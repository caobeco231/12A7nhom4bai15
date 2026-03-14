export const ores = [
  { metal: 'Nhôm (Al)', name: 'Bauxite', formula: 'Al₂O₃·2H₂O' },
  { metal: 'Sắt (Fe)', name: 'Hematite', formula: 'Fe₂O₃' },
  { metal: 'Sắt (Fe)', name: 'Pyrite', formula: 'FeS₂' },
  { metal: 'Canxi (Ca)', name: 'Calcite', formula: 'CaCO₃' },
  { metal: 'Natri (Na)', name: 'Halite', formula: 'NaCl' },
  { metal: 'Kẽm (Zn)', name: 'Sphalerite', formula: 'ZnS' },
  { metal: 'Đồng (Cu)', name: 'Chalcopyrite', formula: 'CuFeS₂' },
];

export const extractionMethods = [
  {
    name: 'Điện phân (Electrolysis)',
    metals: 'Na, Mg, Al',
    equation: '2NaCl → 2Na + Cl₂',
    desc: 'Dùng dòng điện một chiều để khử ion kim loại.',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    name: 'Nhiệt luyện (Thermal Reduction)',
    metals: 'Zn, Fe, Sn, Pb, Cu',
    equation: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂',
    desc: 'Dùng chất khử (C, CO, H₂, Al) ở nhiệt độ cao.',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    name: 'Thủy luyện (Hydrometallurgy)',
    metals: 'Cu, Ag, Au',
    equation: 'Fe + CuSO₄ → Cu + FeSO₄',
    desc: 'Dùng dung dịch hòa tan, sau đó dùng kim loại mạnh đẩy kim loại yếu.',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  }
];

export const glossary = [
  { term: 'Ore (Quặng)', def: 'Khoáng vật chứa kim loại hoặc hợp chất của kim loại có giá trị kinh tế.' },
  { term: 'Electrolysis (Điện phân)', def: 'Quá trình sử dụng dòng điện để tạo ra phản ứng hóa học.' },
  { term: 'Thermal Reduction (Nhiệt luyện)', def: 'Phương pháp tách kim loại bằng cách dùng chất khử ở nhiệt độ cao.' },
  { term: 'Hydrometallurgy (Thủy luyện)', def: 'Phương pháp tách kim loại dựa trên các phản ứng hóa học trong dung dịch.' },
  { term: 'Recycling (Tái chế)', def: 'Quá trình thu gom và xử lý vật liệu phế thải để tạo ra sản phẩm mới.' },
  { term: 'Oxide', def: 'Hợp chất của oxy với một nguyên tố khác.' },
  { term: 'Cation', def: 'Ion mang điện tích dương.' },
  { term: 'Anion', def: 'Ion mang điện tích âm.' },
  { term: 'Reduction (Khử)', def: 'Quá trình nhận electron.' },
  { term: 'Oxidation (Oxy hóa)', def: 'Quá trình nhường electron.' }
];

export const quizQuestions = [
  {
    q: 'Phương pháp nào dùng để điều chế Nhôm (Al) trong công nghiệp?',
    options: ['Nhiệt luyện', 'Thủy luyện', 'Điện phân nóng chảy', 'Điện phân dung dịch'],
    ans: 2,
    exp: 'Nhôm là kim loại hoạt động mạnh, chỉ có thể điều chế bằng điện phân nóng chảy quặng Bauxite (Al₂O₃).'
  },
  {
    q: 'Quặng Hematite chứa thành phần chính là gì?',
    options: ['FeS₂', 'Fe₂O₃', 'Fe₃O₄', 'FeCO₃'],
    ans: 1,
    exp: 'Hematite là quặng sắt quan trọng, thành phần chính là Fe₂O₃.'
  },
  {
    q: 'Chất khử nào thường được dùng trong phương pháp nhiệt luyện?',
    options: ['CO, C, H₂, Al', 'NaCl, KCl', 'H₂SO₄, HCl', 'NaOH, KOH'],
    ans: 0,
    exp: 'Các chất khử mạnh như C, CO, H₂, Al được dùng để lấy oxy từ oxit kim loại ở nhiệt độ cao.'
  },
  {
    q: 'Bước đầu tiên trong quy trình tái chế kim loại là gì?',
    options: ['Nghiền và nén chặt', 'Thu gom và phân loại', 'Nung chảy', 'Tạo vật liệu mới'],
    ans: 1,
    exp: 'Thu gom và phân loại phế liệu là bước đầu tiên và quan trọng nhất để đảm bảo chất lượng kim loại tái chế.'
  },
  {
    q: 'Phản ứng Fe + CuSO₄ → Cu + FeSO₄ thuộc phương pháp nào?',
    options: ['Điện phân', 'Nhiệt luyện', 'Thủy luyện', 'Nhiệt phân'],
    ans: 2,
    exp: 'Đây là phương pháp thủy luyện, dùng kim loại mạnh (Fe) đẩy kim loại yếu (Cu) ra khỏi dung dịch muối.'
  }
];

export const flashcards = [
  { front: 'Bauxite', back: 'Quặng chính của Nhôm (Al₂O₃·2H₂O)' },
  { front: 'Hematite', back: 'Quặng chính của Sắt (Fe₂O₃)' },
  { front: 'Điện phân nóng chảy', back: 'Phương pháp tách các kim loại mạnh (Na, Mg, Al)' },
  { front: 'Nhiệt luyện', back: 'Phương pháp tách kim loại trung bình/yếu bằng chất khử (C, CO, H₂, Al) ở nhiệt độ cao' },
  { front: 'Thủy luyện', back: 'Dùng dung dịch hòa tan, sau đó dùng kim loại mạnh đẩy kim loại yếu' },
  { front: 'Tái chế kim loại', back: 'Thu gom, phân loại, nung chảy và tạo vật liệu mới từ phế liệu' },
];

export const comparisonData = [
  {
    criteria: 'Kim loại áp dụng',
    electrolysis: 'Mạnh (Na, Mg, Al)',
    thermal: 'Trung bình & Yếu (Zn, Fe, Pb, Cu)',
    hydro: 'Yếu (Cu, Ag, Au)'
  },
  {
    criteria: 'Nguyên lý',
    electrolysis: 'Dùng dòng điện một chiều khử ion kim loại',
    thermal: 'Dùng chất khử (C, CO, H₂) ở nhiệt độ cao',
    hydro: 'Dùng kim loại mạnh đẩy kim loại yếu trong dung dịch'
  },
  {
    criteria: 'Nhiệt độ',
    electrolysis: 'Rất cao (nóng chảy) hoặc Thường (dung dịch)',
    thermal: 'Cao (nung trong lò)',
    hydro: 'Thường'
  },
  {
    criteria: 'Ưu điểm',
    electrolysis: 'Độ tinh khiết cao, tách được kim loại mạnh',
    thermal: 'Sản xuất lượng lớn, chi phí thấp',
    hydro: 'Ít ô nhiễm không khí, áp dụng cho quặng nghèo'
  }
];

// Virtual Lab Reactions Dictionary
export const labReactions = [
  {
    id: 'electrolysis_water',
    type: 'electrolysis',
    reactants: ['H2O', 'H2SO4'],
    equipment: 'electrolytic_cell',
    products: ['H2', 'O2'],
    equation: '2H₂O → 2H₂↑ + O₂↑',
    desc: 'Điện phân nước có pha thêm chút H₂SO₄ để tăng độ dẫn điện.',
    animation: 'bubbles_both_electrodes'
  },
  {
    id: 'thermal_cuo_c',
    type: 'thermal',
    reactants: ['CuO', 'C'],
    equipment: 'furnace',
    products: ['Cu', 'CO'],
    equation: 'CuO + C → Cu + CO↑',
    desc: 'Khử Đồng(II) oxit bằng Cacbon ở nhiệt độ cao.',
    animation: 'color_change_black_to_red'
  },
  {
    id: 'hydro_fe_cuso4',
    type: 'hydro',
    reactants: ['Fe', 'CuSO4'],
    equipment: 'beaker',
    products: ['Cu', 'FeSO4'],
    equation: 'Fe + CuSO₄ → Cu↓ + FeSO₄',
    desc: 'Sắt đẩy Đồng ra khỏi dung dịch muối.',
    animation: 'color_change_blue_to_green_with_precipitate'
  },
  {
    id: 'hydro_cu_agno3',
    type: 'hydro',
    reactants: ['Cu', 'AgNO3'],
    equipment: 'beaker',
    products: ['Ag', 'Cu(NO3)2'],
    equation: 'Cu + 2AgNO₃ → 2Ag↓ + Cu(NO₃)₂',
    desc: 'Đồng đẩy Bạc ra khỏi dung dịch muối.',
    animation: 'color_change_clear_to_blue_with_silver_precipitate'
  },
  {
    id: 'metal_acid_zn_hcl',
    type: 'hydro',
    reactants: ['Zn', 'HCl'],
    equipment: 'beaker',
    products: ['ZnCl2', 'H2'],
    equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    desc: 'Kẽm tác dụng với axit clohidric sinh ra khí hidro.',
    animation: 'bubbles_vigorous'
  },
  {
    id: 'metal_acid_na_h2o',
    type: 'hydro',
    reactants: ['Na', 'H2O'],
    equipment: 'beaker',
    products: ['NaOH', 'H2'],
    equation: '2Na + 2H₂O → 2NaOH + H₂↑',
    desc: 'Natri phản ứng mãnh liệt với nước.',
    animation: 'bubbles_vigorous_fire'
  },
  {
    id: 'thermal_fe2o3_co',
    type: 'thermal',
    reactants: ['Fe2O3', 'CO'],
    equipment: 'furnace',
    products: ['Fe', 'CO2'],
    equation: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂↑',
    desc: 'Khử Sắt(III) oxit bằng khí CO (mô phỏng luyện gang).',
    animation: 'color_change_red_to_grey'
  },
  {
    id: 'thermal_al_fe2o3',
    type: 'thermal',
    reactants: ['Al', 'Fe2O3'],
    equipment: 'crucible',
    products: ['Fe', 'Al2O3'],
    equation: '2Al + Fe₂O₃ → 2Fe + Al₂O₃',
    desc: 'Phản ứng nhiệt nhôm, tỏa nhiệt rất mạnh, dùng để hàn đường ray.',
    animation: 'intense_fire_sparks'
  },
  {
    id: 'hydro_k_h2o',
    type: 'hydro',
    reactants: ['K', 'H2O'],
    equipment: 'beaker',
    products: ['KOH', 'H2'],
    equation: '2K + 2H₂O → 2KOH + H₂↑',
    desc: 'Kali phản ứng rất mãnh liệt với nước, tự bốc cháy với ngọn lửa màu tím.',
    animation: 'bubbles_vigorous_purple_fire'
  },
  {
    id: 'hydro_ca_h2o',
    type: 'hydro',
    reactants: ['Ca', 'H2O'],
    equipment: 'beaker',
    products: ['Ca(OH)2', 'H2'],
    equation: 'Ca + 2H₂O → Ca(OH)₂↓ + H₂↑',
    desc: 'Canxi phản ứng với nước tạo ra dung dịch đục do Ca(OH)2 ít tan.',
    animation: 'bubbles_white_precipitate'
  },
  {
    id: 'hydro_fe_hcl',
    type: 'hydro',
    reactants: ['Fe', 'HCl'],
    equipment: 'test_tube',
    products: ['FeCl2', 'H2'],
    equation: 'Fe + 2HCl → FeCl₂ + H₂↑',
    desc: 'Sắt tác dụng với axit clohidric sinh ra khí hidro và dung dịch màu lục nhạt.',
    animation: 'bubbles_green_solution'
  },
  {
    id: 'hydro_cu_hno3',
    type: 'hydro',
    reactants: ['Cu', 'HNO3'],
    equipment: 'beaker',
    products: ['Cu(NO3)2', 'NO2', 'H2O'],
    equation: 'Cu + 4HNO₃(đặc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O',
    desc: 'Đồng tác dụng với axit nitric đặc sinh ra khí NO2 màu nâu đỏ.',
    animation: 'brown_gas_blue_solution'
  },
  {
    id: 'hydro_naoh_cuso4',
    type: 'hydro',
    reactants: ['NaOH', 'CuSO4'],
    equipment: 'beaker',
    products: ['Cu(OH)2', 'Na2SO4'],
    equation: '2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄',
    desc: 'Tạo kết tủa Đồng(II) hidroxit màu xanh lam.',
    animation: 'blue_precipitate'
  },
  {
    id: 'hydro_bacl2_h2so4',
    type: 'hydro',
    reactants: ['BaCl2', 'H2SO4'],
    equipment: 'test_tube',
    products: ['BaSO4', 'HCl'],
    equation: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl',
    desc: 'Tạo kết tủa Bari sunfat màu trắng, không tan trong axit.',
    animation: 'white_precipitate'
  },
  {
    id: 'hydro_na2co3_hcl',
    type: 'hydro',
    reactants: ['Na2CO3', 'HCl'],
    equipment: 'flask',
    products: ['NaCl', 'CO2', 'H2O'],
    equation: 'Na₂CO₃ + 2HCl → 2NaCl + CO₂↑ + H₂O',
    desc: 'Muối cacbonat tác dụng với axit mạnh sinh ra khí CO2.',
    animation: 'bubbles_vigorous'
  },
  {
    id: 'thermal_caco3',
    type: 'thermal',
    reactants: ['CaCO3'],
    equipment: 'furnace',
    products: ['CaO', 'CO2'],
    equation: 'CaCO₃ → CaO + CO₂↑',
    desc: 'Nhiệt phân đá vôi (Canxi cacbonat) tạo ra vôi sống (Canxi oxit).',
    animation: 'color_change_white_to_white_gas'
  }
];
