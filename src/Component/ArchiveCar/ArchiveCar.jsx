import React, { useEffect, useMemo, useState } from 'react'
import './ArchiveCar.scss'
import { MdDeleteForever, MdOutlineDelete, MdRestorePage, MdSettingsBackupRestore } from 'react-icons/md';
import { toast } from 'react-toastify';
import { API_URL } from '../../apiConfig';
import axios from 'axios';
import ApiService from '../../axiosConfig';
import Loader from '../Page/loader/Loader';

const ArchiveCar = ({searchTerm}) => {
  const [viewArchive, setViewArchive] = useState([]);
  const [loader, setloader] = useState(true);


  const fetchData = async () => {
    setloader(true);
    try {
      const response = await ApiService.get('/ArchiveCar');
      setViewArchive(response.data.Archive);
      console.log(response.data.Archive);
    } catch (error) {
      console.error("Erreur lors de la récupération des archives:", error);
    }
    setloader(false);
  };

  // Supprimer définitivement
  const handDelete = async (id) => {
    await ApiService.delete(`/DeleteForce/${id}`);
    setViewArchive(viewArchive.filter(item => item.id !== id));
    toast.success('Supprimé avec succès!');
  };
  

  // Restaurer le véhicule
  const handRestore = async (id) => {
    await ApiService.get(`/retosreCar/${id}`);
    setViewArchive(viewArchive.filter(item => item.id !== id));
    toast.success('Restauré avec succès!');
  };

  // menu 2 active
  const [Active, setActive] = useState(null);

  // start users and clients deleted
  const [deletedEntities, setDeletedEntities] = useState({
    clients: [],
    users: [],
  });

  const fechAllData = async()=>{
    setloader(true);
    await ApiService.get('/userDelete')
    .then((response) => {
      setDeletedEntities(response.data);
    })
    .catch((error) => {
      console.error(
        "There was an error fetching the deleted entities!",
        error
      );
    });
    setloader(false);
  }

  useEffect(() => {
    fetchData();
    fechAllData();
  }, []);

  // Supprimer définitivement
  const handleDelete = async (id, type) => {
    try {
      await ApiService.delete(`/ForceDelet${type}/${id}`);
      setDeletedEntities((prevState) => ({
        ...prevState,
        [type]: prevState[type].filter((item) => item.id !== id),
      }));
      toast.success("Supprimé avec succès!");
    } catch (error) {
      console.error("Error deleting entity", error);
      toast.error("Erreur lors de la suppression!");
    }
  };

  // Restaurer
  const handleRestore = async (id, type) => {
    try {
      await ApiService.patch(`/restore${type}/${id}`);
      setDeletedEntities((prevState) => ({
        ...prevState,
        [type]: prevState[type].filter((item) => item.id !== id),
      }));
      toast.success("Restauré avec succès!");
    } catch (error) {
      console.error("Error restoring entity", error);
      toast.error("Erreur lors de la restauration!");
    }
  };
  const filteredCar = useMemo(()=>{
    return viewArchive.filter(val=>(val.marque + ' '+val.description+' '+val.matricule).toLocaleLowerCase().match(searchTerm.toLocaleLowerCase()))
  },[searchTerm,viewArchive])
  const filteredUser = useMemo(()=>{
    return deletedEntities.users.filter(val=>(val.name + ' '+val.email+' '+val.deleted_by_user.name).toLocaleLowerCase().match(searchTerm.toLocaleLowerCase()))
  },[searchTerm,deletedEntities])
  const filteredClient = useMemo(()=>{
    return deletedEntities.clients.filter(val=>(val.name + ' '+val.email+' '+val.deleted_by_client.name).toLocaleLowerCase().match(searchTerm.toLocaleLowerCase()))
  },[searchTerm,deletedEntities])

  // end users and clients deleted
  if(loader){
    return (
        <Loader />
    )
    }
    else
  return (
    <div className='ContArchive'>
      <div className="table-Archive">
        <div className="entet">
          <h1>Corbeille</h1>
          <div className="menu">
            <button className={`${Active ? '' : 'active'}`} onClick={() => setActive(null)}>Vehicule</button>
            <button className={`${Active ? 'active' : ''}`} onClick={() => setActive(1)}>Client & Users</button>
          </div>
        </div>
        <div className="tableCar">

          {
            Active ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Deleted By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClient.clients.map((client) => (
                    <tr key={`client-${client.id}`}>
                      <td>{client.id}</td>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>Client</td>
                      <td>
                        {client.deleted_by_client
                          ? client.deleted_by_client.name
                          : "N/A"}
                      </td>
                      <td className="btnPlace">
                        <button className='IconBtn force'>
                          <span className='tooltip'>Supprimer</span>
                          <MdOutlineDelete onClick={() => handleDelete(client.id, 'clients')}
                            className="btnIcon" />
                        </button>

                        <button className='IconBtn restore'>
                          <span className='tooltip'>Restore</span>
                          <MdSettingsBackupRestore onClick={() => handleRestore(client.id, 'clients')}
                            className='btnIcon' />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUser.users.map((user) => (
                    <tr key={`user-${user.id}`}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>User</td>
                      <td>
                        {user.deleted_by_user ? user.deleted_by_user.name : "N/A"}
                      </td>
                      <td className="btnPlace">
                        <button className="IconBtn force">
                          <span className='tooltip'>Supprimer</span>
                          <MdOutlineDelete onClick={() => handleDelete(user.id, 'users')}
                            className='btnIcon' />
                        </button>

                        <button className="IconBtn restore haut">
                          <span className='tooltip'>Restore</span>
                          <MdSettingsBackupRestore onClick={() => handleRestore(user.id, 'users')}
                            className='btnIcon' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
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
                  {filteredCar.map((archive, i) => (
                    <tr key={i}>
                      <td>{archive.marque}</td>
                      <td>{archive.matricule}</td>
                      <td>{archive.prix}</td>
                      <td>{archive.user ? archive.user.name : 'Inconnu'}</td>
                      <td className='btnPlace'>
                        <button className='IconBtn force' onClick={() => handDelete(archive.id)}>
                          <span className='tooltip'>Supprimer</span>
                          <MdOutlineDelete className='btnIcon' />
                        </button>
                        <button className='IconBtn restore' onClick={() => handRestore(archive.id)}>
                          <span className='tooltip'>Restore</span>
                          <MdSettingsBackupRestore className='btnIcon' />
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table >
            )}
        </div >
      </div >
    </div >
  );
};

export default ArchiveCar;
