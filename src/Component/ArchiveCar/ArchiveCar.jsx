import React, { useEffect, useState } from 'react'
import './ArchiveCar.scss'
import axios from 'axios';
import { MdDeleteForever, MdOutlineDelete, MdRestorePage, MdSettingsBackupRestore } from 'react-icons/md';
import { toast } from 'react-toastify';

const ArchiveCar = () => {
  const [viewArchive, setViewArchive] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/ArchiveCar");
      console.log(response.data.Archive);
      setViewArchive(response.data.Archive);
    } catch (error) {
      console.error("Erreur lors de la récupération des archives:", error);
    }
  };

  // Supprimer définitivement
  const handDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/DeleteForce/${id}`);
    setViewArchive(viewArchive.filter(item => item.id !== id));
    toast.success('Supprimé avec succès!');
  };

  // Restaurer le véhicule
  const handRestore = async (id) => {
    await axios.get(`http://127.0.0.1:8000/api/retosreCar/${id}`);
    setViewArchive(viewArchive.filter(item => item.id !== id));
    toast.success('Restauré avec succès!');
  };

  return (
    <div className='ContArchive'>
      <div className="table-Archive">
        <h1>Archive des véhicules</h1>
        <div className="tableCar">
          <table>
            <thead>
              <tr>
                <th>Marque</th>
                <th>Matricule</th>
                <th>Prix</th>
                <th>Supprimé par</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {viewArchive.map((archive, i) => (
                <tr key={i}>
                  <td>{archive.marque}</td>
                  <td>{archive.matricule}</td>
                  <td>{archive.prix}</td>
                  <td>{archive.user ? archive.user.name : 'Inconnu'}</td>
                  <td className='btnPlace'>
                    <button className='IconBtn force' onClick={() => handDelete(archive.id)}>
                    <span className='tooltip'>Supprimer</span>
                    <MdOutlineDelete  className='btnIcon'  />
                    </button>
                    <button className='IconBtn restore' onClick={() => handRestore(archive.id)}>
                    <span className='tooltip'>Restore</span>
                    <MdSettingsBackupRestore className='btnIcon' />
                    </button>
                
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchiveCar;
