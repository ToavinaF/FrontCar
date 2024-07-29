import React, { useEffect, useState } from 'react';
import { IoCameraOutline } from "react-icons/io5";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { CiCircleCheck, CiTrash } from "react-icons/ci";
import { useDropzone } from 'react-dropzone';
import './ModifCar.scss';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css'; // Importer les styles Swiper


const ModifCar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ShowUpload, setShowUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [currentImage, setCurrentImage] = useState([]);
  const [currentGalerie, setCurrentGalerie] = useState([]);
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

  const handleImageClick = () => {
    setShowUpload(true);
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedImage(prevImages => [
      ...prevImages,
      ...acceptedFiles
    ]);
    setCurrentImage(null); // Supprime l'ancienne image
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



  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    accept: 'image/*'
  });


  // modification car
  const { id } = useParams();

  const fetchGal = async () => {
    try {
      const galView = await axios.get("http://127.0.0.1:8000/api/viewGalerie/" + id);
      setCurrentGalerie(galView.data.galerie);
      console.log(galView.data.galerie);
    } catch (error) {
      console.log("Verifier le code");
    }
  }
  useEffect(() => {
    fetchModif();
    fetchGal();
  }, [id])

  const fetchModif = async () => {
    try {
      const affiche = await axios.get("http://127.0.0.1:8000/api/detail/" + id);

      setFormData(affiche.data.detailCar);
      setCurrentImage(affiche.data.detailCar.photo || []);
      console.log(affiche.data);

    } catch (error) {
      console.log("verifier le code");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('marque', formData.marque);
    data.append('matricule', formData.matricule);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('porte', formData.porte);
    data.append('transmission', formData.transmission);
    data.append('place', formData.place);
    data.append('bagage', formData.bagage);

    if (selectedImage.length > 0) {
      data.append('photo', selectedImage[0]);
    }
    selectedImage.forEach(file => {
      data.append('images[]', file);
    });
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/updateCare/" + id, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/Home/listcar')
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

   //suppression galerie
   const handDelete = async (id) =>{
    try {
        console.log(id);
        await axios.delete('http://127.0.0.1:8000/api/PhotoDelete/'+id);
    const newGalerie = currentGalerie.filter((item)=>{
        return(
            item.id !== id
        )
    })
    setCurrentGalerie(newGalerie);
    } catch (error) {
        console.log('ts mande');
    }
}
  return (
    <>
      <div className="block">
        <form onSubmit={handleSubmit} className='form'>
          <div className="parti-left">
            <div className="image" onClick={handleImageClick}>
              {selectedImage.length > 0 ? (
                <div>
                  <img src={URL.createObjectURL(selectedImage[0])} alt="Selected" />
                  <div className='put'></div>
                </div>
              ) : currentImage ? (
                <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${currentImage}`} alt="Current" />
              ) : (
                <IoCameraOutline className='cam' />
              )}
            </div>

            <div className="caracter">
              <label htmlFor="marque">{t('Marque du vehicule')}</label>
              <input type="text" placeholder={t('Marque du vehicule')} className='input' name='marque' value={formData.marque} onChange={handleChange} />
            </div>
            <div className="caracter">
              <label htmlFor="matricule">{t('Matricule du vehicule')}</label>
              <input type="text" placeholder={t('Matricule du vehicule')} className='input' name='matricule' value={formData.matricule} onChange={handleChange} />
            </div>
            <div className="caracter">
              <label htmlFor="transmission">{t('Type de transmission')}</label>
              <select name="transmission" className='input' value={formData.transmission} onChange={handleChange}>
                <option value="Automatique">Automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </div>
          </div>
          <div className="parti-right">
            <div className="caracter">
              <label htmlFor="prix">{t('prix du vehicule')}</label>
              <input type="text" placeholder={t('prix du vehicule')} className='input' name='prix' value={formData.prix} onChange={handleChange} />
            </div>
            <div className="caracter">
              <label htmlFor="bagage">{t('Nombre de bagage')}</label>
              <select name="bagage" className='input' value={formData.bagage} onChange={handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="caracter">
              <label htmlFor="place">{t('Nombre de place')}</label>
              <select name="place" className='input' value={formData.place} onChange={handleChange}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>

              </select>
            </div>
            <div className="caracter">
              <label htmlFor="porte">{t('Nombre de porte')}</label>
              <select name="porte" className='input' value={formData.porte} onChange={handleChange}>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="apro">
              <label htmlFor="description">{t('Apropos du vehicule')}</label>
              <textarea id="description" className='desc' name='description' value={formData.description} onChange={handleChange}></textarea>
            </div>
            <button type='submit' className='btn'>{t('Enregistre')}</button>
          </div>
          {ShowUpload && (
            <div className="image-upload">
              <FaXmark className='x' onClick={() => setShowUpload(false)} />
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>{t('Glissez-déposez une image ici, ou cliquez pour sélectionner une image')}</p>
                <IoAddCircleSharp className='plus' />
              </div>
              {selectedImage.length > 0 && (
                <div className="barImg">
                  {selectedImage.map((file, index) => (
                    <div key={index} className="partImg">
                      <div className="image-container">
                        <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                        <div className="cach"><CiTrash className='check' onClick={() => handleRemoveImage(index)} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentGalerie.length > 0 && (
                <div className="barImg">
                  {currentGalerie.map((imageName, index) => (
                    <div key={index} className="partImg">
                      <div className="image-container">
                        <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${imageName.image}`} alt={`Current ${index}`} />
                        <div className="cach"><CiTrash className='check' onClick={()=>handDelete(imageName.id)} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ModifCar;
