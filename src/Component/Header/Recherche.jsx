import React, { useState } from 'react';

const Recherche = ({ placeholder, data, setSearchTerm }) => {
    const [wordEntered, setWordEntered] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleFilter = (event) => {
        const valeur = event.target.value;
        setWordEntered(valeur);
        setSearchTerm(valeur);

        // Filtrage des données
        const newFilter = data.filter((value) => {
            return value.marque.toLowerCase().includes(valeur.toLowerCase());
        });

        if (valeur === '') {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

   

    return (
        <div className="recherche-container">
            <input
                type='text'
                placeholder={placeholder}
                value={wordEntered}
                onChange={handleFilter}
                
            />
           
        </div>
    );
};

export default Recherche;
