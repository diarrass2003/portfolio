import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { MiniGame } from '../mini-game/mini-game';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Projects, MiniGame, Contact],
  templateUrl: './home.html'
})
export class Home { }
