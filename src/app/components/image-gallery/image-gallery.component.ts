import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: string[] = [];

  activeImageIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}

  setActiveImage(index: number) {
    this.activeImageIndex = index;
  }
}
