if(!window.isBanter) {
  const images = [
    'https://firer.at/files/FireRat-Transparentv3.webp',
    'https://firer.at/files/FireRat-Logo-V2.png',
    'https://firer.at/files/FireRat-Zaleska.png',
    'https://firer.at/files/DALL_E_2024-10-17_11.30.56.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.13.19.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.12.23.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.10.56.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.09.14.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.08.00.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.07.15.webp',
    'https://firer.at/files/DALL_E_2024-10-20_22.16.14.webp',
    'https://firer.at/files/DALL_E_2024-10-20_22.21.40.webp',
    'https://firer.at/files/DALL_E_2024-10-20_22.21.01.webp',
    'https://firer.at/files/DALL_E_2024-10-20_22.19.56.webp',
    'https://firer.at/files/DALL_E_2024-10-20_20.14.31.webp',
    'https://firer.at/files/FireRat-(1).jpeg',
    'https://firer.at/files/FireRat-(2).jpeg',
    'https://firer.at/files/FireRat-(3).jpeg',
    'https://firer.at/files/FireRat-(4).jpeg',
    'https://firer.at/files/FireRat-(5).jpeg',
    'https://firer.at/files/FireRat-(6).jpeg',
    'https://firer.at/files/FireRat-(7).jpeg',
    'https://firer.at/files/FireRat-(8).jpeg',
    'https://firer.at/files/FireRat-(9).jpeg',
    'https://firer.at/files/FireRat-(10).jpeg',
    'https://firer.at/files/FireRat-(11).jpeg',
    'https://firer.at/files/FireRat-(12).jpeg',
    'https://firer.at/files/FireRat-(13).jpeg',
    'https://firer.at/files/FireRat-(14).jpeg',
    'https://firer.at/files/FireRat-(15).jpeg',
    'https://firer.at/files/FireRat-(16).jpeg',
    'https://firer.at/files/FireRat-(17).jpeg',
    'https://firer.at/files/FireRat-(18).jpeg',
    'https://firer.at/files/FireRat-(19).jpeg',
    'https://firer.at/files/FireRat-(20).jpeg',
    'https://firer.at/files/FireRat-(21).jpeg',
    'https://firer.at/files/FireRat-(22).jpeg',
    'https://firer.at/files/FireRat-(23).jpeg',
    'https://firer.at/files/FireRat-(24).jpeg',
    'https://firer.at/files/FireRat-(25).jpeg',
    'https://firer.at/files/FireRat-(26).jpeg',
    'https://firer.at/files/FireRat-(27).jpeg',
    'https://firer.at/files/FireRat-(28).jpeg',
    'https://firer.at/files/FireRat-(29).jpeg',
    'https://firer.at/files/FireRat-(30).jpeg',
    'https://firer.at/files/FireRat-(31).jpeg',
    'https://firer.at/files/FireRat-(32).jpeg'
  ];

  function setRandomBackground() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.documentElement.style.setProperty( '--background-image', `url('${randomImage}')`);
  };

  setRandomBackground();
}