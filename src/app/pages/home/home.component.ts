import { Component, OnInit } from '@angular/core';
import { PokemonFilterComponent } from '../../components/pokemon-filter/pokemon-filter.component';
import { PokeapiService } from '../../core/services/pokeapi.service';
import { CommonModule } from '@angular/common';
import { PokemonDetailsComponent } from '../../components/pokemon-details/pokemon-details.component';

interface PokemonOption {
  name: string;
  id: number;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PokemonFilterComponent , PokemonDetailsComponent, CommonModule],
  providers: [PokeapiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  selectedPokemon: PokemonOption | null = null;
  pokemonDetails: any = null;


  constructor(private pokemonapiService: PokeapiService) { }


  ngOnInit(): void {
    
  }

  onPokemonSelected(pokemon: PokemonOption) {  
    this.selectedPokemon = pokemon; 
    this.loadPokemonDetails();
  }

  loadPokemonDetails() {
    if (this.selectedPokemon) {
      this.pokemonapiService.getHability(this.selectedPokemon.id.toString())
        .subscribe((pokemonDetails: any) => {
          const spanishEntries = pokemonDetails.flavor_text_entries
          .filter((entry: { language: { name: string; }; }) => entry.language.name === "es");
    
        console.log(spanishEntries);
       
      })
    }
  }

  

}
