// Define the type for the data object
type RegionData = {
  [region: string]: {
    [city: string]: string[];
  };
};

// Define the data object with the specified type
const data: RegionData = {
    NCR: {
      'City of Manila': ['Barangay 1', 'Barangay 2'],
      'Quezon City': ['Barangay 3', 'Barangay 4'],
    },
    CAR: {
      Baguio: ['Barangay 5', 'Barangay 6'],
      'La Trinidad': ['Barangay 7', 'Barangay 8'],
    },
    RegionXII: {
      'General Santos City': [
        'Apopong', 'Baluan', 'Batomelong', 'Buayan', 'Bula', 'Calumpang', 'City Heights', 
        'Conel', 'Dadiangas East', 'Dadiangas North', 'Dadiangas South', 'Dadiangas West', 
        'Fatima', 'Katangawan', 'Labangal', 'Lagao', 'Ligaya', 'Mabuhay', 'Olympog', 'San Isidro', 
        'San Jose', 'Siguel', 'Sinawal', 'Tambler', 'Tinagacan', 'Upper Labay'
      ],
      'Koronadal City': [
        'Assumption (Bulol)', 'Avanceña', 'Cacub', 'Caloocan', 'Carpenter Hill', 'Concepcion', 
        'Esperanza', 'General Paulino Santos', 'Mabini', 'Mambucal', 'Morales', 'Namnama', 'Paraiso', 
        'Poblacion', 'Rotonda', 'San Isidro', 'San Jose', 'San Roque', 'Santa Cruz', 'Santo Niño', 
        'Saravia', 'Topland', 'Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Zone V'
      ],
      'Kidapawan City': [
        'Amas', 'Amazion', 'Balabag', 'Binoligan', 'Birada', 'Gayola', 'Ginatilan', 'Ilomavis', 
        'Indangan', 'Junction', 'Kalaisan', 'Katipunan', 'Lanao', 'Linangkob', 'Luvimin', 'Macabolig', 
        'Malinan', 'Manongol', 'Marbel', 'Mateo', 'Meohao', 'Mua-an', 'New Bohol', 'Nuangan', 'Onica', 
        'Paco', 'Patadon', 'Perez', 'Poblacion', 'San Isidro', 'San Roque', 'Santo Niño', 'Sikitan', 
        'Singao', 'Sudapin', 'Balindog', 'Poblacion', 'Luvimin', 'Magsaysay', 'Sikitan'
      ],
      'Tacurong City': [
        'Baras', 'Buenaflor', 'Calean', 'EJC Montilla', 'Griño', 'Kalandagan', 'Lancheta', 'Lapu', 
        'Lower Katungal', 'New Isabela', 'New Lagao', 'Poblacion', 'San Antonio', 'San Emmanuel', 
        'San Pablo', 'San Rafael', 'Tina', 'Upper Katungal', 'Rajah Muda', 'Talakag'
      ],
      'Cotabato City': [
        'Bagua I', 'Bagua II', 'Bagua III', 'Kalanganan I', 'Kalanganan II', 'Poblacion I', 'Poblacion II', 
        'Poblacion III', 'Poblacion IV', 'Poblacion V', 'Poblacion VI', 'Poblacion VII', 'Poblacion VIII', 
        'Poblacion IX', 'Poblacion X', 'Rosary Heights I', 'Rosary Heights II', 'Rosary Heights III', 
        'Rosary Heights IV', 'Rosary Heights V', 'Rosary Heights VI', 'Rosary Heights VII', 'Rosary Heights VIII', 
        'Rosary Heights IX', 'Rosary Heights X', 'Rosary Heights XI', 'Tamontaka I', 'Tamontaka II', 
        'Tamontaka III', 'Tamontaka IV', 'Tamontaka V', 'Kalanganan II', 'Mother Barangay Poblacion', 
        'Bagua Mother', 'Bubong', 'Capiton', 'Datu Balabaran'
      ]
    },
    // Add more regions, cities, and barangays as needed
};

export default data;
