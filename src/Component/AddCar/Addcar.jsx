import React, { useState } from 'react';
import { IoAlertCircleOutline, IoCameraOutline } from "react-icons/io5";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { CiCircleCheck, CiTrash } from "react-icons/ci";
import { useDropzone } from 'react-dropzone';
import './Addcar.scss';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addcar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ShowUpload, setShowUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    matricule: '',
    description: '',
    prix: '',
    porte: '',
    transmission: '',
    place: '',
    bagage: ''
  });
  const [errors, setErrors] = useState({});
  const handleImageClick = () => {
    setShowUpload(true);
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedImage(prevImages => [
      ...prevImages,
      ...acceptedFiles
    ]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImage(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
    const data = new FormData();
    data.append('marque', formData.marque);
    data.append('matricule', formData.matricule);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('porte', formData.porte);
    data.append('transmission', formData.transmission);
    data.append('place', formData.place);
    data.append('bagage', formData.bagage);
    data.append('photo', selectedImage[0]);
    selectedImage.forEach(file => {
      data.append('images[]', file);
    });
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/AddCar", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message);
      navigate('/Home/listcar');


    } catch (error) {
      toast.error('Veuillez remplire les champs.');
      console.error(error);
    }
  };
  //gestion erreur formulaire
  const validForm = () => {
    const errors = {};
    if (!formData.marque) errors.marque = 'Ce champ est requis !';
    if (!formData.matricule) errors.matricule = 'Ce champ est requis !';
    if (!formData.prix) errors.prix = 'Ce champ est requis !';
    if (!formData.bagage) errors.bagage = 'Ce champ est requis !';
    if (!formData.place) errors.place = 'Ce champ est requis !';
    if (!formData.porte) errors.porte = 'Ce champ est requis !';
    if (!formData.description) errors.description = 'Ce champ est requis !';
    if (!formData.transmission) errors.transmission = 'Ce champ est requis !';

    return errors;
  };
  // ///////

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    accept: 'image/*'
  });

  return (
    <>
      <div className="block">
        <form onSubmit={handleSubmit} className='form'>
          {/* Drop zone */}
          <div className={`image-upload ${errors.photo ? 'upload-error' : ''}`}>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {selectedImage.length > 0 && (
                <div className="barImg">
                  {selectedImage.map((file, index) => (
                    <div key={index} className="partImg" onClick={(e) => e.stopPropagation()}>
                      <div className="image-container">
                        <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                        <div className="cach"><CiTrash className='check' onClick={(e) => handleRemoveImage(index)} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p>{t('Glissez-déposez une image ici, ou cliquez pour sélectionner une image')}</p>
              <IoAddCircleSharp className='plus' />
            </div>

          </div>
          {errors.photo && <p className="error-photo"><span><IoAlertCircleOutline /></span>{errors.photo}</p>}

          {/* end dropzone */}

          <div className="content_form">
            <div className="parti-left">
              {/* formulaire */}
              <div className="caracter">
                <label htmlFor="marque"> {t('Marque du vehicule')}</label>
                <input type="text" placeholder={t('Marque du vehicule')} className={`input ${errors.marque ? 'input-error' : ''}`} name='marque' onChange={handleChange} />
                {/* affichage d'erreur de chaque champ */}
                {errors.marque && <p className="error-text"><span><IoAlertCircleOutline /></span> {errors.marque}</p>}
              </div>
              <div className="caracter">
                <label htmlFor="matricule">{t('Matricule du vehicule')}</label>
                <input type="text" placeholder={t('Matricule du vehicule')} className={`input ${errors.matricule ? 'input-error' : ''}`} name='matricule' onChange={handleChange} />
                {errors.matricule && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.matricule}</p>}
              </div>
              <div className="caracter">
                <label htmlFor="transmission">{t('Type de transmission')}</label>
                <select name="transmission" className={`input ${errors.transmission ? 'input-error' : ''}`} onChange={handleChange}>
                  <option></option>
                  <option value="Automatique">Automatique</option>
                  <option value="Manuelle">Manuelle</option>
                </select>
                {errors.transmission && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.transmission}</p>}
              </div>
            </div>

            <div className="parti-right">
              <div className="caracter">
                <label htmlFor="prix">{t('prix du vehicule')}</label>
                <input type="text" placeholder={t('prix du vehicule')} className={`input ${errors.prix ? 'input-error' : ''}`} name='prix' onChange={handleChange} />
                {errors.prix && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.prix}</p>}
              </div>
              <div className="caracter">
                <label htmlFor="bagage">{t('Nombre de bagage')}</label>
                <select name="bagage" className={`input ${errors.bagage ? 'input-error' : ''}`} onChange={handleChange}>
                  <option></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                {errors.bagage && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.bagage}</p>}
              </div>
              <div className="caracter">
                <label htmlFor="place">{t('Nombre de place')}</label>
                <select name="place" className={`input ${errors.place ? 'input-error' : ''}`} placeholder='nombre de place' onChange={handleChange}>
                  <option></option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>

                </select>
                {errors.place && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.place}</p>}

              </div>
              <div className="caracter">
                <label htmlFor="porte">{t('Nombre de porte')}</label>
                <select name="porte" className={`input ${errors.porte ? 'input-error' : ''}`} onChange={handleChange}>
                  <option></option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </select>
                {errors.porte && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.porte}</p>}

              </div>
              <div className="desc_car">
                <label htmlFor="description">{t('Apropos du vehicule')}</label>
                <textarea id="description" className={`desc ${errors.description ? 'input-error' : ''}`} name='description' onChange={handleChange}></textarea>
                {errors.description && <p className="error-text"><span><IoAlertCircleOutline /></span>{errors.description}</p>}
              </div>
              <button type='submit' className='btn'>{t('Enregistre')}</button>
            </div>

            {/* end formulaire */}
          </div>
        </form>
      </div>
    </>
  );
};

export default Addcar;
