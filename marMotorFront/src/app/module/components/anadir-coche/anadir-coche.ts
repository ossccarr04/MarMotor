import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Importamos ActivatedRoute
import { FuelType } from '../../../@types/enums/fuelType.enum';
import { BrandServiceBBDD } from '../../services/brand-service-bbdd';
import { BodyTypeServiceBBDD } from '../../services/bodyType-service-bbdd';
import { BrandDTO } from '../../../@types/interface/brand.interface';
import { BodyTypeDTO } from '../../../@types/interface/bodyType.interface';
import { Transmission } from '../../../@types/enums/transmission.enum';
import { HistoryIcon, HistoryIconLabel } from '../../../@types/enums/history-icon.enum';

@Component({
  selector: 'app-anadir-coche',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './anadir-coche.html',
  styleUrls: ['./anadir-coche.scss'],
})
export class AnadirCoche implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inyectamos la ruta activa
  private toast = inject(ToastrService);
  private carService = inject(CarServiceBBDD);
  private brandService = inject(BrandServiceBBDD);
  private bodyTypeService = inject(BodyTypeServiceBBDD);

  carForm!: FormGroup;
  isSubmitting = false;

  // Lógica de Edición
  isEditMode = false;
  carId: string | null = null;

  fotoPortada: File | null = null;
  fotosGaleria: File[] = [];
  previewPortada: string | null = null;
  previewsGaleria: string[] = [];

  marcasSugeridas: string[] = [];
  carroceriasSugeridas: string[] = [];
  combustiblesSugeridos = Object.values(FuelType).filter((v) => typeof v === 'string');
  transmissions = Object.values(Transmission).filter((v) => typeof v === 'string');

  iconosDisponibles = Object.entries(HistoryIcon).map(([key, value]) => ({
    label: HistoryIconLabel.get(value) || key,
    value: value
  }));
  
  ngOnInit() {
    this.cargarSugerencias();
    this.initForm();

    // DETECTAR MODO EDICIÓN
    this.carId = this.route.snapshot.paramMap.get('id');
    if (this.carId) {
      this.isEditMode = true;
      this.cargarDatosParaEditar(this.carId);
    }
  }

  private initForm() {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      price: ['', [Validators.required, Validators.min(0)]],
      power: ['', Validators.required],
      mileage: ['', Validators.required],
      consumption: ['', Validators.required],
      transmission: ['Manual', Validators.required],
      brandName: ['', Validators.required],
      fuelTypeName: ['', Validators.required],
      bodyTypeName: [null],
      color: ['', Validators.required],
      badge: [null],
      description: ['', Validators.required],
      features: this.fb.array([]),
      history: this.fb.array([]),
    });
  }

  cargarDatosParaEditar(id: string) {
    const idDecoded = atob(id);
    this.carService.getCarsDetails(idDecoded).subscribe({
      next: (car) => {
        // Rellenar campos simples
        this.carForm.patchValue({
          model: car.model,
          year: car.year,
          price: car.price,
          power: car.power,
          mileage: car.mileage,
          consumption: car.consumption,
          transmission: car.transmission,
          brandName: car.make, // Ojo: verifica si tu DTO usa 'make' o 'brandName'
          fuelTypeName: car.fuelType,
          bodyTypeName: car.bodyType,
          color: car.color,
          badge: car.badge,
          description: car.description,
        });

        // Rellenar Equipamiento (FormArray)
        car.features?.forEach((f: string) => {
          this.features.push(this.fb.control(f, Validators.required));
        });

        // Rellenar Historial (FormArray)
        car.history?.forEach((h: any) => {
          this.history.push(
            this.fb.group({
              year: [h.year, Validators.required],
              title: [h.title, Validators.required],
              icon: [h.icon || '🔧'],
              isCompleted: [h.isCompleted],
            }),
          );
        });

        // Mostrar imágenes actuales como preview
        if (car.imagesAlbum && car.imagesAlbum.length > 0) {
          this.previewPortada = car.imagesAlbum[0];
          this.previewsGaleria = car.imagesAlbum.slice(1);
        }

        this.cdr.detectChanges();
      },
      error: () => this.toast.error('No se pudieron cargar los datos del vehículo'),
    });
  }

  // --- GETTERS Y MÉTODOS DINÁMICOS ---
  get features(): FormArray {
    return this.carForm.get('features') as FormArray;
  }
  get history(): FormArray {
    return this.carForm.get('history') as FormArray;
  }

  addFeature() {
    this.features.push(this.fb.control('', Validators.required));
  }
  removeFeature(i: number) {
    this.features.removeAt(i);
  }

  addHistoryEvent() {
    this.history.push(
      this.fb.group({
        year: [new Date().getFullYear(), Validators.required],
        title: ['', Validators.required],
        icon: [HistoryIcon.MANTENIMIENTO], // Usas el enum aquí
        isCompleted: [false],
      }),
    );
  }
  removeHistoryEvent(i: number) {
    this.history.removeAt(i);
  }

  // --- GESTIÓN DE IMÁGENES (Mantienes tu lógica rápida con URL.createObjectURL) ---
  onPortadaSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.fotoPortada = file;
    if (this.previewPortada && !this.isEditMode) URL.revokeObjectURL(this.previewPortada);
    this.previewPortada = URL.createObjectURL(file);
    this.cdr.detectChanges();
  }

  onGallerySelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.fotosGaleria = [...this.fotosGaleria, ...files];
    const nuevasPreviews = files.map((file) => URL.createObjectURL(file));
    this.previewsGaleria = [...this.previewsGaleria, ...nuevasPreviews];
    this.cdr.detectChanges();
    event.target.value = '';
  }

  removePortada() {
    this.fotoPortada = null;
    this.previewPortada = null;
    this.cdr.detectChanges();
  }

  removeFromGallery(index: number) {
    this.fotosGaleria.splice(index, 1);
    this.previewsGaleria.splice(index, 1);
    this.cdr.detectChanges();
  }

  // --- ENVÍO ---
onSubmit() {
  const formRawValue = this.carForm.getRawValue();

  // Filtramos las imágenes que se quedan (las que ya tienen URL de Cloudinary)
  const currentExistingImages: string[] = [];
  
  // Si la portada actual es de Cloudinary (no es un blob local), se queda
  if (this.previewPortada && this.previewPortada.startsWith('http')) {
    currentExistingImages.push(this.previewPortada);
  }
  
  // Lo mismo con la galería
  this.previewsGaleria.forEach(url => {
    if (url.startsWith('http')) {
      currentExistingImages.push(url);
    }
  });

  const carData = {
    ...formRawValue,
    existingImages: currentExistingImages, // Mandamos la lista de "sobrevivientes"
    clearImages: currentExistingImages.length === 0 && !this.fotoPortada && this.fotosGaleria.length === 0,
    history: formRawValue.history.map((h: any) => ({
      ...h,
      isCompleted: !!h.isCompleted,
    })),
  };

  const formData = new FormData();
  formData.append('carData', JSON.stringify(carData));

  // Solo adjuntamos los archivos FÍSICOS nuevos
  if (this.fotoPortada) formData.append('images', this.fotoPortada);
  this.fotosGaleria.forEach((f) => formData.append('images', f));


    // 5. LLAMADA AL SERVICIO
    const idDecoded = atob(this.carId!);
    const request = this.isEditMode
      ? this.carService.updateCar(idDecoded!, formData)
      : this.carService.createCarWithImages(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode ? 'Vehículo actualizado.' : 'Vehículo creado.');
        this.router.navigate(['/coches']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error Backend:', err);
        this.toast.error('Error al guardar. Revisa la consola o los datos.');
      },
    });
  }

  autoGrow(element: any) {
    element.style.height = 'auto'; // Resetea la altura para recalcular
    element.style.height = element.scrollHeight + 'px'; // Ajusta a la altura del texto
  }

  cargarSugerencias() {
    this.brandService
      .getBrands()
      .subscribe((d) => (this.marcasSugeridas = d.map((b: BrandDTO) => b.name)));
    this.bodyTypeService
      .getBodyTypes()
      .subscribe((d) => (this.carroceriasSugeridas = d.map((bt: BodyTypeDTO) => bt.name)));
  }
}
