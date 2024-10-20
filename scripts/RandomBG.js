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
    'https://firer.at/files/DALL_E_2024-10-20_20.14.31.webp'
  ];

  function setRandomBackground() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.documentElement.style.setProperty( '--background-image', `url('${randomImage}')`);
  };

  setRandomBackground();
}