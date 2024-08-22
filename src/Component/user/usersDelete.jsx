import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever, MdRestorePage } from "react-icons/md";
import { toast } from "react-toastify";
import './usersDelete.scss'
const DeletedEntitiesTable = () => {
  const [deletedEntities, setDeletedEntities] = useState({
    clients: [],
    users: [],
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/userDelete").then((response) => {
        setDeletedEntities(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the deleted entities!",
          error
        );
      });
  }, []);

  // Supprimer définitivement
  const handDelete = async (id, type) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/DeleteForce/${id}`);
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
  const handRestore = async (id, type) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/restore${type}/${id}`);
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

  return (
    <div className="ContDelete">
    <div className="table-Delete">
      <h2>Deleted Clients and Users</h2>
      <div className="tableUser">
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
          {deletedEntities.clients.map((client) => (
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
                <MdDeleteForever
                  className="IconBtn force"
                  onClick={() => handDelete(client.id, 'clients')}
                />
                <MdRestorePage
                  className="IconBtn restore"
                  onClick={() => handRestore(client.id, 'clients')}
                />
              </td>
            </tr>
          ))}
          {deletedEntities.users.map((user) => (
            <tr key={`user-${user.id}`}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>User</td>
              <td>
                {user.deleted_by_user ? user.deleted_by_user.name : "N/A"}
              </td>
              <td className="btnPlace">
                <MdDeleteForever
                  className="IconBtn force"
                  onClick={() => handDelete(user.id, 'users')}
                />
                <MdRestorePage
                  className="IconBtn restore"
                  onClick={() => handRestore(user.id, 'users')}
                />
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

export default DeletedEntitiesTable;
