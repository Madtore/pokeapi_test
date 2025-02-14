import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PokemonDetailService } from '../../services/pokemon-details.service';
import { Router } from '@angular/router';

interface PokemonEvolution {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-evolution-chain',
  standalone: true,
  imports: [CommonModule, CarouselModule, CardModule, ButtonModule],
  templateUrl: './evolution-chain.component.html',
  styleUrl: './evolution-chain.component.scss'
})
export class EvolutionChainComponent implements OnChanges {
  @Input() evolutionChainId: number | null = null;
  @Input() currentPokemonId: number | null = null;
  
  evolutions: PokemonEvolution[] = [];
  loading = false;
  currentIndex = 0;
  
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  
  constructor(
    private pokemonDetailService: PokemonDetailService,
    private router: Router
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['evolutionChainId'] || changes['currentPokemonId']) && 
         this.evolutionChainId) {
      this.loadEvolutions();
    }
  }
  
  loadEvolutions() {
    if (this.evolutionChainId) {
      this.loading = true;
      this.pokemonDetailService.getEvolutionChain(this.evolutionChainId)
        .subscribe({
          next: (data) => {
            this.evolutions = data;
            this.setCurrentIndex();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    }
  }
  
  setCurrentIndex() {
    if (this.currentPokemonId && this.evolutions.length > 0) {
      const index = this.evolutions.findIndex(e => e.id === this.currentPokemonId);
      if (index !== -1) {
        this.currentIndex = index;
      }
    }
  }
  
  getEvolutionStatus(index: number): string {
    if (this.currentPokemonId === this.evolutions[index].id) {
      return 'current';
    } else if (index < this.currentIndex) {
      return 'pre';
    } else {
      return 'post';
    }
  }
  
  viewEvolutionDetails(pokemonId: number) {
    // Navigate to the selected Pokémon's detail page
    this.router.navigate(['/pokemon', pokemonId]);
  }
}