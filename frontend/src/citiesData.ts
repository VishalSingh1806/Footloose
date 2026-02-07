export const STATES_AND_CITIES: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai', 'Sangli', 'Malegaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalgaon', 'Bhiwandi'],

  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Gadag', 'Robertsonpet', 'Hassan', 'Bhadravati', 'Chitradurga', 'Udupi'],

  'Delhi': ['New Delhi', 'Delhi Cantonment', 'Narela', 'Dwarka', 'Rohini', 'Janakpuri', 'Karol Bagh', 'Saket', 'Connaught Place', 'Rajouri Garden', 'Vasant Kunj', 'Lajpat Nagar', 'Mayur Vihar', 'Pitampura', 'Nehru Place', 'Green Park', 'Hauz Khas', 'Shahdara', 'Malviya Nagar', 'Vikaspuri'],

  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Tiruppur', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumbakonam'],

  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad'],

  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Gandhidham', 'Anand', 'Nadiad', 'Morbi', 'Surendranagar', 'Bharuch', 'Mehsana', 'Bhuj', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi'],

  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh', 'Barmer', 'Chittorgarh', 'Nagaur', 'Jhunjhunu'],

  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat'],

  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha'],

  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah', 'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha'],

  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kadapa', 'Kakinada', 'Tirupati', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Hindupur', 'Bhimavaram'],

  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Miryalaguda', 'Jagtial', 'Mancherial', 'Nirmal', 'Kamareddy', 'Kothagudem', 'Bodhan', 'Palwancha', 'Mandamarri'],

  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kottayam', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad', 'Payyanur', 'Koyilandy', 'Parappanangadi', 'Kalamassery', 'Neyyattinkara', 'Tanur'],

  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Mohali', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Faridkot'],

  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Hansi', 'Narnaul'],

  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon', 'Tinsukia', 'Jorhat', 'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Tezpur', 'Karimganj', 'Goalpara', 'Barpeta', 'Lanka', 'Lumding', 'Sivasagar', 'Golaghat', 'Mangaldoi', 'Haflong'],

  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Balangir', 'Rayagada', 'Bhawanipatna', 'Dhenkanal', 'Barbil', 'Kendujhar', 'Sunabeda', 'Jatani'],

  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Jhumri Tilaiya', 'Saunda', 'Sahibganj', 'Chaibasa', 'Gumia', 'Dumka', 'Madhupur', 'Chatra', 'Godda'],

  'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Chirmiri', 'Dhamtari', 'Mahasamund', 'Kanker', 'Kawardha', 'Bhatapara', 'Tilda Newra', 'Mungeli', 'Manendragarh', 'Sakti', 'Dongargarh'],

  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Punch', 'Rajauri', 'Kupwara', 'Bandipore', 'Kulgam', 'Ganderbal', 'Pulwama', 'Shopian', 'Budgam', 'Handwara', 'Bijbehara', 'Qazigund', 'Uri'],

  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Ramnagar', 'Rudraprayag', 'Manglaur', 'Nainital', 'Mussoorie', 'Tehri', 'Pauri', 'Bageshwar', 'Almora', 'Champawat', 'Kotdwara', 'Sitarganj'],

  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Kullu', 'Hamirpur', 'Una', 'Bilaspur', 'Chamba', 'Kangra', 'Parwanoo', 'Sundernagar', 'Jogindernagar', 'Nurpur', 'Rampur', 'Manali', 'Dalhousie'],

  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Bishalgarh', 'Teliamura', 'Khowai', 'Belonia', 'Melaghar', 'Mohanpur', 'Ambassa', 'Ranirbazar', 'Santirbazar', 'Kumarghat', 'Sonamura', 'Panisagar', 'Amarpur', 'Jirania', 'Kamalpur', 'Sabrum'],

  'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara', 'Williamnagar', 'Nongpoh', 'Mairang', 'Mawlai', 'Cherrapunji', 'Resubelpara', 'Ampati', 'Khliehriat', 'Mawkyrwat', 'Ranikor', 'Nongkrem', 'Lawsohtun', 'Madanrting', 'Umsning', 'Songsak'],

  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Kakching', 'Churachandpur', 'Ukhrul', 'Senapati', 'Tamenglong', 'Jiribam', 'Moirang', 'Mayang Imphal', 'Yairipok', 'Heirok', 'Wangjing', 'Sekmai', 'Nambol', 'Andro', 'Thongkhong', 'Kumbi', 'Lilong'],

  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Kiphire', 'Longleng', 'Peren', 'Chumukedima', 'Tseminyu', 'Pfutsero', 'Jalukie', 'Tuli', 'Atoizu', 'Changtongya', 'Longkhim', 'Satakha'],

  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem', 'Canacona', 'Pernem', 'Mormugao', 'Sanguem', 'Valpoi', 'Aldona', 'Cortalim', 'Navelim', 'Cavelossim', 'Benaulim'],

  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Seppa', 'Changlang', 'Along', 'Namsai', 'Roing', 'Daporijo', 'Khonsa', 'Anini', 'Yingkiong', 'Basar', 'Namsai', 'Aalo', 'Jairampur'],

  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Hnahthial', 'Saitul', 'Khawzawl', 'Bairabi', 'Vairengte', 'North Vanlaiphai', 'Thenzawl', 'Zawlnuam', 'Darlawn', 'Tlabung', 'Khawhai', 'Biate'],

  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Rangpo', 'Jorethang', 'Nayabazar', 'Singtam', 'Yuksom', 'Ravangla', 'Pelling', 'Soreng', 'Rongli', 'Melli', 'Chungthang', 'Lachen', 'Lachung', 'Pakyong', 'Rhenock', 'Mangan Bazar'],

  'Puducherry': ['Puducherry', 'Karaikal', 'Yanam', 'Mahe', 'Ozhukarai', 'Villianur', 'Bahour', 'Kurumbapet', 'Ariankuppam', 'Kalapet', 'Thirubhuvanai', 'Nettapakkam', 'Embalam', 'Kottucherry', 'Mannadipet', 'Thirukanchi', 'Thirubuvanai', 'Seliamedu', 'Pillaichavady', 'Mudaliarpet'],

  'Chandigarh': ['Chandigarh', 'Mani Majra', 'Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Panchkula', 'Mohali', 'Zirakpur', 'Kharar', 'Dera Bassi', 'Sector 8', 'Sector 9', 'Sector 15', 'Sector 21', 'Sector 34', 'Sector 44', 'Sector 45', 'Sector 46', 'Sector 47'],

  'Andaman & Nicobar': ['Port Blair', 'Diglipur', 'Mayabunder', 'Rangat', 'Hut Bay', 'Car Nicobar', 'Nancowry', 'Campbell Bay', 'Bamboo Flat', 'Garacharma', 'Ferrargunj', 'Wimberlygunj', 'Kadamtala', 'Baratang', 'Neil Island', 'Havelock Island', 'Little Andaman', 'Great Nicobar', 'Teressa', 'Katchal'],

  'Dadra & Nagar Haveli': ['Silvassa', 'Amli', 'Naroli', 'Rakholi', 'Piparia', 'Khanvel', 'Sayli', 'Khadoli', 'Dudhani', 'Rudana', 'Sili', 'Mota Randha', 'Mashat', 'Velugam', 'Karad', 'Athola', 'Bedpa', 'Bonta', 'Dahikhed', 'Dolara'],

  'Daman & Diu': ['Daman', 'Diu', 'Nani Daman', 'Moti Daman', 'Kadaiya', 'Marwad', 'Dunetha', 'Ringanwada', 'Jampore', 'Devka', 'Vanakbara', 'Ghoghla', 'Nagoa', 'Fudam', 'Bucharwada', 'Bhimpore', 'Kachigam', 'Pariyari', 'Dalwada', 'Zari'],

  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kalpeni', 'Kadmat', 'Kiltan', 'Chetlat', 'Bitra'],

  'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Zanskar', 'Drass', 'Khalsi', 'Nyoma', 'Diskit', 'Panamik', 'Turtuk', 'Sankoo', 'Shargole', 'Chuchot', 'Stakna', 'Khaltse', 'Batalik', 'Thiksey', 'Hemis', 'Tangste', 'Hanle'],
};

export const STATES = Object.keys(STATES_AND_CITIES);
