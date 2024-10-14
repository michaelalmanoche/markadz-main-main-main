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

    RegionI: {
      'Laoag City': [
        'Araniw', 'Balatong', 'Balatong 2nd', 'Bani', 'Barit', 'Barong', 'Ben-agan', 'Buttong',
        'Cabungaan North', 'Cabungaan South', 'Calayab', 'Camangaan', 'Cavit', 'Cataban', 'Caunayan',
        'Darayday', 'Dibua North', 'Dibua South', 'Gabu Norte East', 'Gabu Norte West',
        'Gabu Sur East', 'Gabu Sur West', 'Lagui-Sail', 'Lataag', 'Lagui', 'Pasicnalgan', 'Navotas',
        'Nangalisan East', 'Nangalisan West', 'Pila', 'Raquiza', 'Suyo', 'Vira', 'Barangays 1-55'
      ],
      'Batac City': [
        'Ablan Sarat', 'Acosta', 'Aliguas', 'Aglipay', 'Baay', 'Baligat', 'Baoa East', 'Baoa West',
        'Bil-loca', 'Binacag', 'Biningan', 'Bungon', 'Bulbulala', 'Caunayan', 'Colo', 'Dariwdiw',
        'Hilario', 'Maipalig', 'Mangato', 'Nalupta', 'Naguirangan', 'Naguirongan', 'Palpalicong',
        'Payao', 'Quiling Norte', 'Quiling Sur', 'Quiom', 'Tabug'
      ],
      'Vigan City': [
        'Ayusan Norte', 'Ayusan Sur', 'Barangays 1-24 (Poblacion)'
      ],
      'Candon City': [
        'Allangigan 1st', 'Allangigan 2nd', 'Amguid', 'Ayudante', 'Bagani Campo', 'Bagani Gabor',
        'Bagani Tocgo', 'Bagani Upli', 'Bagani Yaog', 'Balingaoan', 'Banayoyo', 'Bugnay', 'Calaoa-an',
        'Calangcuasan', 'Langlangca 1st', 'Langlangca 2nd', 'Malimanga', 'Nagsingcalan', 'Napo',
        'Oaig Daya', 'Palacapac', 'Paratong', 'San Antonio', 'San Isidro', 'San Juan', 'San Vicente', 'Santo Tomas'
      ],
      'San Fernando City': [
        'Abut', 'Apaleng', 'Bangcusay', 'Baraoas Norte', 'Baraoas Sur', 'Bato', 'Birunget', 'Biday', 'Bungro',
        'Cabaroan', 'Calabugao', 'Camansi', 'Dallangayan Este', 'Dallangayan Oeste', 'Dalumpinas Este',
        'Dalumpinas Oeste', 'Lingsat', 'Pagdalagan', 'Poro', 'Puspus', 'San Agustin', 'San Francisco Norte',
        'San Francisco Sur', 'San Vicente', 'Santiago Norte', 'Santiago Sur', 'Siboan Otong', 'Sevilla Norte',
        'Sevilla Sur'
      ],
      'Alaminos City': [
        'Amandiego', 'Amangbangan', 'Balangobong', 'Baleyadaan', 'Bisocol', 'Bolaney', 'Bued', 'Cabatuan',
        'Cayucay', 'Dangley', 'Inerangan', 'Landoc', 'Linmansangan', 'Lucap', 'Maawi', 'Macatiw',
        'Magsaysay', 'Mona', 'Palamis', 'Pandan', 'Polo', 'Pocalpocal', 'Quibuar', 'Sabangan', 'San Antonio',
        'San Jose', 'San Roque', 'San Vicente', 'Santa Maria', 'Tangcarang', 'Tawintawin'
      ],
      'Dagupan City': [
        'Bacayao Norte', 'Bacayao Sur', 'Bonuan Binloc', 'Bonuan Boquig', 'Bonuan Gueset', 'Calmay',
        'Carael', 'Caranglaan', 'Herrero-Perez', 'Lasip Chico', 'Lasip Grande', 'Lomboy', 'Lucao', 'Malued',
        'Mamalingling', 'Mangin', 'Mayombo', 'Pantal', 'Poblacion Oeste', 'Poblacion Sur', 'Salisay',
        'Salapingao', 'Tambac', 'Tapuac', 'Tebeng'
      ],
      'San Carlos City': [
        'Agdao', 'Anando', 'Antipangol', 'Bacnar', 'Balaya', 'Balungao', 'Bantog', 'Bolingit', 'Cacabugaoan',
        'Capataan', 'Coliling', 'Cruz', 'Doyong', 'Ilang', 'Libas', 'Lucban', 'Maasin', 'Magtaking', 'Malacañang',
        'Mamalingling', 'Payar', 'Tayambong'
      ],
      'Urdaneta City': [
        'Anonas', 'Bayaoas', 'Bolaoen', 'Cabaruan', 'Camantiles', 'Camanang', 'Casantaan', 'Catablan',
        'Consolacion', 'Dilan-Paurido', 'Labit Proper', 'Labit West', 'Mabanogbog', 'Macalong', 'Nancamaliran East',
        'Nancamaliran West', 'Oltama', 'Palina East', 'Palina West', 'Pinmaludpod', 'Poblacion', 'San Jose', 'San Vicente'
      ]
    },
    // Add more regions, cities, and barangays as needed
  
    // Add more regions, cities, and barangays as needed
};

export default data;
