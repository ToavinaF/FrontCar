import React from "react";
import axios from "axios";
import "./AllUser.scss";

const AllUser = () => {
    // const [users, setUsers] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await axios.get("http://127.0.0.1:8000/api/Users");
    //             setUsers(response.data.users); // Assuming the response directly contains the user array
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching users:", error);
    //             setError(error.message);
    //             setLoading(false);
    //         }
    //     };

    //     fetchUsers();
    // }, []);

  

    return (
        <div className="user-list">
            <header className="header">
                <h1>Utilisateurs</h1>
            </header>
            <div className="project-stats">
                <button className="btn">Tous les utilisateurs</button>
            </div>
            <div className="user-cards">
             
                        <div className="user-card" >
                            <div className="user-card-header">
                                
                                <span>jeo doe</span>
                            </div>
                            <div className="user-card-body">
                                <p>Email: admin@gmail.com</p>
                                <p>Job: dev</p>
                                <p>Contact: 1234</p>
                                <p>Role: admin</p>
                            </div>
                        : (
                    <div>No users found.</div>
              
            </div>
        </div>
      
    );
    </div>
    )
};

export default AllUser;
