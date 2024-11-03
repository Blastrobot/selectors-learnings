import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { FilteredCountry, Region } from '../../interfaces/countries.interfaces';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: FilteredCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });

  constructor (
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}
  
  ngOnInit(): void {
    this.onRegionChanged();
  };

  public get regions(): Region[] {
    return this.countriesService.regions;
  };

  public onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe( countries => {
        this.countriesByRegion = countries;
        console.log({ countries })
      })
  };
};