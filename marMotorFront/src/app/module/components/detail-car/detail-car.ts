import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarDetail } from '../../../@types/interface/car-details.interface';

@Component({
  selector: 'detail-car',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-car.html',
  styleUrls: ['./detail-car.scss'],
})
export class DetailCar implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private scrollPosition: number = 0;

  car: CarDetail | undefined;
  currentIndex: number = 0; // Índice en la lista de coches
  currentImageIndex: number = 0; // Índice de la foto en el álbum
  isZoomed: boolean = false;

  // Tu array de coches (Simulado, idealmente vendría de un Service)
  cars: CarDetail[] = [
    {
      id: 1,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 324,
      consumption: '3.5%',
      color: 'Pearl White',
      description:
        'Tesla Model Y Long Range. An electric SUV with massive interior space and class-leading technology.',
      features: ['Autopilot', 'Panoramic Roof', 'Heated Seats', 'Supercharging Ready'],
      history: [
        { year: 2015, title: 'Matriculación', icon: 'fa-car', isCompleted: true },
        { year: 2019, title: 'Cambio propietario', icon: 'fa-user', isCompleted: true },
        { year: 2020, title: 'Mantenimiento', icon: 'fa-wrench', isCompleted: true },
        { year: 2023, title: 'Revisión oficial', icon: 'fa-clipboard-check', isCompleted: true },
        { year: 2025, title: 'Próxima ITV', icon: 'fa-calendar-alt', isCompleted: false },
      ],
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 2,
      make: 'SEAT',
      model: 'ATECA',
      year: 2022,
      price: 28500,
      imageUrl: 'assets/car1.',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Petrol',
      transmission: 'Manual',
      power: 150,
      mileage: 15400,
      consumption: '3.5%',
      color: 'Rhodium Grey',
      description:
        'The SEAT Ateca combines robust design with surprising agility for daily commutes.',
      features: ['Full Link', 'Parking Sensors', 'Cruise Control', 'Dual-zone Climate'],
      history: [
        { year: 2015, title: 'Matriculación', icon: 'fa-car', isCompleted: true },
        { year: 2019, title: 'Cambio propietario', icon: 'fa-user', isCompleted: true },
        { year: 2020, title: 'Mantenimiento', icon: 'fa-wrench', isCompleted: true },
        { year: 2023, title: 'Revisión oficial', icon: 'fa-clipboard-check', isCompleted: true },
        { year: 2025, title: 'Próxima ITV', icon: 'fa-calendar-alt', isCompleted: false },
      ],
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 3,
      make: 'AUDI',
      model: 'Q4 E-TRON',
      year: 2024,
      price: 52000,
      imageUrl: 'assets/car1.png',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 204,
      mileage: 400,
      consumption: '3.1%',
      color: 'Navarra Blue',
      description:
        'Audi’s electric sophistication. A futuristic interior with premium finishes and a silent drive.',
      features: ['Audi Virtual Cockpit', 'Matrix LED Headlights', 'Premium Sound', '360 Camera'],
      history: [
        { year: 2015, title: 'Matriculación', icon: 'fa-car', isCompleted: true },
        { year: 2019, title: 'Cambio propietario', icon: 'fa-user', isCompleted: true },
        { year: 2020, title: 'Mantenimiento', icon: 'fa-wrench', isCompleted: true },
        { year: 2023, title: 'Revisión oficial', icon: 'fa-clipboard-check', isCompleted: true },
        { year: 2025, title: 'Próxima ITV', icon: 'fa-calendar-alt', isCompleted: false },
      ],
      badge: null,
      badgeType: null,
      isSaved: true,
    },
    {
      id: 4,
      make: 'TESLA',
      model: 'MODEL Y (Long Range)',
      year: 2023,
      price: 54000,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 350,
      mileage: 1200,
      consumption: '3.5%',
      color: 'Solid Black',
      description: 'Long-range version with All-Wheel Drive. Safety and power in every corner.',
      features: ['AWD Drive', 'Sentry Mode', 'Premium Audio', '20" Induction Wheels'],
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 5,
      make: 'TESLA',
      model: 'MODEL Y (Performance)',
      year: 2024,
      price: 59900,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 512,
      mileage: 50,
      consumption: '3.5%',
      color: 'Multi-Coat Red',
      description: 'Sports car acceleration in an SUV body. 0 to 100 km/h in 3.7 seconds.',
      features: ['Performance Brakes', 'Aluminum Pedals', 'Carbon Spoiler', 'Track Mode'],
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 6,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2022,
      price: 45000,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 25000,
      consumption: '3.5%',
      color: 'Midnight Silver',
      description: 'Certified pre-owned unit by MarMotor with full battery warranty.',
      features: ['Ceramic Coating', 'Premium Black Interior', 'OTA Updates'],
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 7,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 100,
      consumption: '3.5%',
      color: 'White',
      description: 'Immediate delivery. Zero-mile car with all technological extras.',
      features: ['Premium Connectivity', 'Heat Pump', 'Power Tailgate'],
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 8,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 47900,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 5000,
      consumption: '3.5%',
      color: 'Deep Blue',
      description: 'Mint condition. Single previous owner. Home charging history available.',
      features: ['Hardware 4.0', 'HD Cameras', 'Vegan Leather Seats'],
      badge: null,
      badgeType: null,
      isSaved: false,
    },
    {
      id: 9,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2024,
      price: 49500,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 10,
      consumption: '3.5%',
      color: 'Quicksilver Grey',
      description: 'Exclusive new factory color. Available for reservation now.',
      features: ['HEPA Filter', '15" Touchscreen', 'Refreshed Center Console'],
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 10,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      imagesAlbum: ['assets/car1.png', 'assets/car2.png', 'assets/car3.png'],
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 324,
      consumption: '3.5%',
      color: 'White',
      description: 'The best value-for-money ratio in the current electric market.',
      features: ['Wireless Charging', '8 Cameras', 'Heated Steering Wheel'],
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
  ] as CarDetail[]; // Cambio aquí: De CarDTO[] a CarDetail[]

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
    const encodedId = params.get('id');
    
    if (encodedId) {
      try {
        // Decodificamos. Importante: no lo fuerces a Number todavía.
        const decodedId = atob(encodedId);
        
        // Si tus IDs en el array 'cars' son números, conviértelo aquí:
        const idFinal = isNaN(Number(decodedId)) ? decodedId : Number(decodedId);
        
        this.loadCar(idFinal);
      } catch (e) {
        console.error("Error decodificando el ID", e);
        this.router.navigate(['/home']);
      }
    }
  });
  }

  private loadCar(id: number | string): void {
    const idNumerico = Number(id);
    const foundCar = this.cars.find((c) => c.id === idNumerico);
    if (foundCar) {
      this.car = foundCar;
      this.currentImageIndex = 0;
      this.currentIndex = this.cars.findIndex((c) => c.id === idNumerico);
      this.closeZoom(); // Reset de zoom al cambiar de coche
    } else {
      this.router.navigate(['/home']);
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const currentSrc = imgElement.src;

    // Si intentó cargar un .jpg y falló, probamos con .png
    if (currentSrc.endsWith('.jpg')) {
      imgElement.src = currentSrc.replace('.jpg', '.png');
    }
    // Si intentó cargar un .png y falló, probamos con .jpg
    else if (currentSrc.endsWith('.png')) {
      imgElement.src = currentSrc.replace('.png', '.jpg');
    }
    // Si ambas fallan, le ponemos una imagen por defecto para que no se vea roto
    else {
      imgElement.src = 'assets/placeholder-car.jpg'; // Tu imagen por defecto
    }
  }

  // --- NAVEGACIÓN DE IMÁGENES ---
  nextImage() {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.car.imagesAlbum.length;
  }

  prevImage() {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.car.imagesAlbum.length) % this.car.imagesAlbum.length;
  }

  setMainImage(index: number): void {
    this.currentImageIndex = index;
  }

  // --- ZOOM ---
  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    const navHeader = document.querySelector('.autoflow-header');

    if (this.isZoomed) {
      // 1. Guardamos cuántos píxeles de scroll hay ahora mismo
      this.scrollPosition = window.pageYOffset;

      // 2. Aplicamos estilos al body para "congelarlo"
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      if (navHeader) {
        this.renderer.setStyle(navHeader, 'display', 'none');
        // O si prefieres que no use espacio:
        // this.renderer.setStyle(navHeader, 'visibility', 'hidden');
      }
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
      if (navHeader) {
        this.renderer.setStyle(navHeader, 'display', 'flex'); // o 'block', según sea tu original
      }

      // 4. Devolvemos al usuario a su sitio exacto (importante)
      window.scrollTo(0, this.scrollPosition);
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'top');
    this.renderer.removeStyle(document.body, 'width');
    this.renderer.removeStyle(document.body, 'background-color');
  }

  private closeZoom(): void {
    this.isZoomed = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  // --- NAVEGACIÓN ENTRE COCHES ---
  nextCar(): void {
    const nextIdx = (this.currentIndex + 1) % this.cars.length;
    const nextId = this.cars[nextIdx].id;
    // Codificamos el ID a Base64
    const encodedId = btoa(nextId.toString());
    this.router.navigate(['/detail-car', encodedId]);
  }

  prevCar(): void {
    const prevIdx = (this.currentIndex - 1 + this.cars.length) % this.cars.length;
    const prevId = this.cars[prevIdx].id;
    // Codificamos el ID a Base64
    const encodedId = btoa(prevId.toString());
    this.router.navigate(['/detail-car', encodedId]);
  }

  // --- WISHLIST ---
  toggleSave(): void {
    if (this.car) {
      this.car.isSaved = !this.car.isSaved;
    }
  }
}
