import { Component, OnInit } from '@angular/core';
import { PokemonFilterComponent } from '../../components/pokemon-filter/pokemon-filter.component';
import { PokeapiService } from '../../core/services/pokeapi.service';
import { CommonModule } from '@angular/common';
import { PokemonDetailsComponent, Pokemon } from '../../components/pokemon-details/pokemon-details.component';
import { PokemonDetailService } from '../../services/pokemon-details.service';


interface PokemonOption {
  name: string;
  id: number;
  url: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PokemonFilterComponent, PokemonDetailsComponent, CommonModule],
  providers: [PokeapiService, PokemonDetailService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  selectedPokemon: PokemonOption | null = null;
  pokemonDetails: Pokemon | null = null;
  loading = false;

  constructor(
    private pokemonDetailService: PokemonDetailService
  ) { }

  ngOnInit(): void {
   
  }

  onPokemonSelected(pokemon: PokemonOption) {  
    this.selectedPokemon = pokemon; 
    this.loadPokemonDetails();
  }

  loadPokemonDetails() {
    if (this.selectedPokemon) {
      this.loading = true;
      this.pokemonDetails = null;
      
      this.pokemonDetailService.getPokemonDetails(this.selectedPokemon.id.toString())
        .subscribe({
          next: (details) => {
            this.pokemonDetails = details;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    }
  }
}