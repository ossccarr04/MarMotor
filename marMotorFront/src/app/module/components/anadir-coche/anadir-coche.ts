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
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';
import { LabelDescriptions, Labels } from '../../../@types/enums/label.enum';

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
  badges = Object.values(BadgeType);
  public labelOptions = Object.values(Labels).map((key) => ({
    value: key,
    label: LabelDescriptions[key],
  }));
  badgeLabels = BadgeLabel;

  nombresEnEspanol: { [key: string]: string } = {
    model: 'Modelo',
    year: 'Año',
    price: 'Precio',
    power: 'Potencia',
    mileage: 'Kilometraje',
    version: 'Versión',
    transmission: 'Transmisión',
    brandName: 'Marca',
    label: 'Etiqueta',
    fuelTypeName: 'Combustible',
    bodyTypeName: 'Carrocería',
    color: 'Color',
    description: 'Descripción',
    features: 'Características',
    history: 'Historial',
  };

  iconosDisponibles = Object.entries(HistoryIcon).map(([key, value]) => ({
    label: HistoryIconLabel.get(value) || key,
    value: value,
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
      model: ['', [Validators.required, Validators.minLength(2)]],
      version: ['', [Validators.required]],
      // El año no puede ser mayor al actual + 1 (coches nuevos)
      year: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)],
      ],
      price: ['', [Validators.required, Validators.min(1)]],
      power: ['', [Validators.required, Validators.min(1), Validators.max(2000)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      transmission: ['Manual', Validators.required],
      brandName: ['', Validators.required],
      fuelTypeName: ['', Validators.required],
      bodyTypeName: [null],
      color: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.\#]+$/)]],
      badge: [BadgeType.NONE],
      label: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!¡?¿\-]+$/),
        ],
      ],
      features: this.fb.array([]),
      history: this.fb.array([]),
    });
  }

  cargarDatosParaEditar(id: string) {
    const idDecoded = atob(id);
    this.carService.getCarsDetails(idDecoded).subscribe({
      next: (car) => {
        const labelValue = car.label.toUpperCase();
        let labelToForm = 'NONE';

        if (labelValue.includes('ZERO') || labelValue.includes('0')) labelToForm = 'ZERO';
        else if (labelValue.includes('ECO')) labelToForm = 'ECO';
        else if (labelValue.includes('C')) labelToForm = 'C';
        else if (labelValue.includes('B')) labelToForm = 'B';
        // 1. Rellenar campos simples
        this.carForm.patchValue({
          model: car.model,
          year: car.year,
          price: car.price,
          power: car.power,
          mileage: car.mileage,
          version: car.version,
          label: labelToForm,
          transmission: car.transmission
            ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1).toLowerCase()
            : 'Manual',
          brandName: car.make,
          fuelTypeName: car.fuelType
            ? car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1).toLowerCase()
            : '',
          bodyTypeName: car.bodyType
            ? car.bodyType.charAt(0).toUpperCase() + car.bodyType.slice(1).toLowerCase()
            : null,
          color: car.color,
          badge: car.badge,
          description: car.description,
        });

        // 2. Limpiar FormArrays antes de cargar (evita duplicados si entras/sales)
        this.features.clear();
        this.history.clear();

        // 3. Rellenar Equipamiento
        car.features?.forEach((f: string) => {
          this.features.push(this.fb.control(f, Validators.required));
        });

        // 4. Rellenar Historial (Aseguramos los nombres de campos)
        if (car.history && car.history.length > 0) {
          car.history.forEach((h: any) => {
            this.history.push(
              this.fb.group({
                // IMPORTANTE: Verifica si en tu BBDD el campo es 'year' o 'año'
                year: [
                  h.year,
                  [
                    Validators.required,
                    Validators.min(1900),
                    Validators.max(new Date().getFullYear()),
                  ],
                ],
                title: [h.title, Validators.required],
                icon: [h.icon || '🔧'],
                // IMPORTANTE: Asegúrate de que el nombre sea 'isCompleted' o 'completed' según tu DTO
                isCompleted: [!!h.isCompleted],
              }),
            );
          });
        }

        // 5. Imágenes
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
  removeFeature(index: number) {
    // Obtenemos la referencia directa y eliminamos por índice
    this.features.removeAt(index);

    // Forzamos a Angular a que se entere del cambio (opcional pero recomendado con ChangeDetectorRef)
    this.cdr.detectChanges();
  }

  addHistoryEvent() {
    this.history.push(
      this.fb.group({
        year: [
          new Date().getFullYear(),
          [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
        ],
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
    if (this.carForm.invalid) {
      Object.keys(this.carForm.controls).forEach((key) => {
        const controlErrors = this.carForm.get(key)?.errors;
        if (controlErrors != null) {
          this.toast.error('Error en el campo ' + this.nombresEnEspanol[key], 'Error');
        }
      });
      this.carForm.markAllAsTouched();
      this.toast.warning('Revisa los campos marcados.', 'Error de validación.');
      return;
    }

    if (!this.fotoPortada && !this.previewPortada) {
      this.toast.warning('Por favor, selecciona una portada.', 'Error en la imagen');
      return;
    }

    if (!this.combustiblesSugeridos.includes(this.carForm.get('fuelTypeName')?.value)) {
      this.toast.warning(
        'Por favor, selecciona un tipo de combustible válido.',
        'Error de combustible',
      );
      return;
    }

    this.isSubmitting = true;

    const formRawValue = this.carForm.getRawValue();
    // Filtramos las imágenes que se quedan (las que ya tienen URL de Cloudinary)
    const currentExistingImages: string[] = [];

    // Si la portada actual es de Cloudinary (no es un blob local), se queda
    if (this.previewPortada && this.previewPortada.startsWith('http')) {
      currentExistingImages.push(this.previewPortada);
    }

    // Lo mismo con la galería
    this.previewsGaleria.forEach((url) => {
      if (url.startsWith('http')) {
        currentExistingImages.push(url);
      }
    });

    const carData = {
      ...formRawValue,
      transmission:
        this.carForm.value.transmission.toUpperCase() === 'AUTOMATICA' ? 'AUTOMATICA' : 'MANUAL',
      existingImages: currentExistingImages, // Mandamos la lista de "sobrevivientes"
      clearImages:
        currentExistingImages.length === 0 && !this.fotoPortada && this.fotosGaleria.length === 0,
      history: formRawValue.history
        .map((h: any) => ({
          ...h,
          isCompleted: !!h.isCompleted,
        }))
        .sort((a: any, b: any) => a.year - b.year),
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
      next: (car: any) => {
        this.toast.success(this.isEditMode ? 'Vehículo actualizado.' : 'Vehículo creado.', 'Éxito');
        const idNavegacion = this.isEditMode ? this.carId : btoa(car.id.toString());
        this.router.navigate(['/detail-car', idNavegacion]);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error Backend:', err);
        this.toast.error('Error al guardar. Revisa la consola o los datos.', 'Error al guardar');
      },
    });
  }

  autoGrow(element: any) {
    element.style.height = 'auto'; // Resetea la altura para recalcular
    element.style.height = element.scrollHeight + 'px'; // Ajusta a la altura del texto
  }

  cargarSugerencias() {
    this.brandService
      .getBrands() // Ya estaba bien
      .subscribe((d) => (this.marcasSugeridas = d.map((b: BrandDTO) => b.name)));
    this.bodyTypeService
      .getBodyTypes()
      .subscribe(
        (d) => (this.carroceriasSugeridas = d.map((bt: BodyTypeDTO) => bt.name.toLowerCase())),
      );
  }
}
