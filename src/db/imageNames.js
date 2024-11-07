const adultImageNames = [
  'aika_20323_SergioPalao.png',
  'aikuinen_19359_Sergio Palao.png',
  'alkoholi_39070_Sergio Palao.png',
  'auto_11631_Annakaisa Ojanen.png',
  'avaimet_21895_Sergio Palao.png',
  'banaani_19607_Sergio Palao.png',
  'bussi_37155_Sergio Palao.png',
  'euro_18980_Sergio Palao.png',
  'haarukka_21235_Sergio Palao.png',
  'ikkuna_24516_Sergio Palao.png',
  'jalka_21971_Sergio Palao.png',
  'jogurtti_4503_Paxtoncrafts Charitable Trust.png',
  'juna_24292_Sergio Palao.png',
  'juusto_4445_Paxtoncrafts Charitable Trust.png',
  'järvi_38565_Elena Chebannaia.png',
  'kahvi_4662_Paxtoncrafts Charitable Trust.png',
  'kala_38883_Sergio Palao.png',
  'kananmuna_21579.png_Sergio Palao.png',
  'kana_20224_Sergio Palao.png',
  'kanelipulla_37875.png_Sergio Palao.png',
  'kastike_34835.png_Paxtoncrafts Charitable Trust.png',
  'kauppa_35186_Paxtoncrafts Charitable Trust.png',
  'kauraleipä_42882_Noel Johansson Ammattiopisto Spesia.png',
  'kenkä_1396_Paxtoncrafts Charitable Trust.png',
  'kevyt_22007_Sergio Palao.png',
  'kirjasto_26462_Sergio Palao.png',
  'kirja_19834_Sergio Palao.png',
  'kirkko_31712_Sergio Palao.png',
  'korva_20888_Sergio Palao.png',
  'kuitti_33522_Sergio Palao.png',
  'kurkku_4857_Paxtoncrafts Charitable Trust.png',
  'kuukausi_3748_Elina Vanninen.png',
  'kuulokkeet_21598_Sergio Palao.png',
  'käsi, oikea_21551.png_Sergio Palao.png',
  'lahja_21350_Sergio Palao.png',
  'lanka_32270_Sergio Palao.png',
  'lapsi_28739_Sergio Palao.png',
  'laukku_19579_Sergio Palao.png',
  'lautanen_22686_Sergio Palao.png',
  'leikkele_19295_Sergio Palao.png',
  'leipä_19103_Sergio Palao.png',
  'liha_22141_Sergio Palao.png',
  'lintu_11557_Elina Vanninen.png',
  'lompakko_24428_Sergio Palao.png',
  'lusikka_21909_Sergio Palao.png',
  'lyhyt_35184_Paxtoncrafts Charitable Trust.png',
  'maito_22183_Sergio Palao.png',
  'mehu_34248_Paxtoncrafts Charitable Trust.png',
  'metsä_39487_Susanna Juuti.png',
  'mies_20531_Sergio Palao.png',
  'murot_20159.png_Sergio Palao.png',
  'nainen_20532_Sergio Palao.png',
  'nenä_22385_Sergio Palao.png',
  'nuori_3548_Elina Vanninen.png',
  'omena_19440_Sergio Palao.png',
  'ovi_20781_Sergio Palao.png',
  'painava_26773_Sergio Palao.png',
  'pankki_26434_Sergio Palao.png',
  'paprika_22592_Sergio Palao.png',
  'pasta_4238_Elina Vanninen.png',
  'perhe_11754_Elina Vanninen.png',
  'pieni_23265_Sergio Palao.png',
  'pitkä_34683_Paxtoncrafts Charitable Trust.png',
  'polkupyörä_19721_Sergio Palao.png',
  'polku_37266_Sergio Palao.png',
  'postitoimisto_26474_Sergio Palao.png',
  'puhelin_22209_Sergio Palao.png',
  'pää_21595_Sergio Palao.png',
  'pöytä_31982.png_Ideogrammi  Sari Kivimäki.png',
  'raha_35298.png_Paxtoncrafts Charitable Trust.png',
  'rasva_19981.png_Sergio Palao.png',
  'reppu_23010.png_Sergio Palao.png',
  'riisi_22954.png_Sergio Palao.png',
  'rintakehä_19895.png_Sergio Palao.png',
  'ruisleipä_32569.png_Sergio Palao.png',
  'ruoka_11877.png_Annakaisa Ojanen.png',
  'saari_21843.png_Sergio Palao.png',
  'sairaala_37134.png_Sergio Palao.png',
  'sakset_23090.png_Sergio Palao.png',
  'sandaali_36144.png_Sergio Palao.png',
  'sanomalehti_30382.png_Sergio Palao.png',
  'sanomalehti_5541.png_Sergio Palao.png',
  'sateenvarjo_11902.png_Annakaisa Ojanen.png',
  'silmä_21026.png_Sergio Palao.png',
  'sohva_6559.png_Elina Vanninen.png',
  'sokeri_23440.png_Sergio Palao.png',
  'sormi_21119.png_Sergio Palao.png',
  'suola_23045.png_Sergio Palao.png',
  'suomi_32952.png_Paxtoncrafts Charitable Trust.png',
  'suuri_19724.png_Sergio Palao.png',
  'suu_22268.png_Sergio Palao.png',
  'sänky_19684.png_Sergio Palao.png',
  'taksi_11633.png_Elina Vanninen.png',
  'talo_12033.png_Elina Vanninen.png',
  'tee_4612.png_Elina Vanninen.png',
  'tomaatti_4883.png_Paxtoncrafts Charitable Trust.png',
  'tuli_21131.png_Sergio Palao.png',
  'tuoli_6556.png_Elina Vanninen.png',
  'työ_20946.png_Sergio Palao.png',
  'vanha_12177.png_Elina Vanninen.png',
  'vatsa_19710.png_Sergio Palao.png',
  'veitsi_21914.png_Sergio Palao.png',
  'vesi_24449.png_Sergio Palao.png',
  'viikko_26731.png_Sergio Palao.png',
  'vuosi_24570.png_Sergio Palao.png',
  'ystävä_21268.png_Sergio Palao.png',
];

const kidImageNames = [];

export { adultImageNames, kidImageNames };
