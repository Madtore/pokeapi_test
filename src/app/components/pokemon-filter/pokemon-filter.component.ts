import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PokeapiService } from '../../core/services/pokeapi.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface PokemonOption {
  name: string;
  url : string;
  id: number;
}

@Component({
  selector: 'app-pokemon-filter',
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.scss'],
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  standalone: true,
  providers: [PokeapiService]
})
export class PokemonFilterComponent implements OnInit {
  @Output() pokemonSelected = new EventEmitter<PokemonOption>();
  
  allPokemon: PokemonOption[] = [];
  filteredPokemon: PokemonOption[] = [];
  selectedPokemon: PokemonOption | null = null;
  
  constructor(private pokemonapiService: PokeapiService) { }

  ngOnInit(): void {
    this.pokemonapiService.getAllPokemons('1000')
    .subscribe((pokemons: any) => {
      this.allPokemon = pokemons.results.map((pokemon: any) => {
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return {
        name: pokemon.name,
        url: pokemon.url,
        id: id 
      };
    });
    });
  }

  filterPokemon(event: any) {
    const query = event.query.toLowerCase();
    this.filteredPokemon = this.allPokemon.filter(
      pokemon => pokemon.name.toLowerCase().includes(query)
    );
  }

  onSelect(event: any) {
    const pokemon :PokemonOption = event.value;
    console.log(pokemon);
    this.pokemonSelected.emit(pokemon);
  }

  onClear() {
    this.selectedPokemon = null;
  }
}
