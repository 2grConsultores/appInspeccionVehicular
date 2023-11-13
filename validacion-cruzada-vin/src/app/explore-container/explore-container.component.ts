import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {

@Input() name?: string;

constructor(
  private router: Router,
) { }

caso(caso: number){
  this.router.navigate(['ocr/'+caso]);
}
  
}
