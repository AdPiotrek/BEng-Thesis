import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string;
  @Input() type: string;
  @Input() lifetime: number = 0;
  @Input() closeOnIcon = false;
  @Output() onClose = new EventEmitter<AlertComponent>();

  constructor() {
  }

  ngOnInit() {
    this.dismissOnTimeout();
  }

  ngOnDestroy() {
    console.log('component is destroyed')
  }


  getAlertClass() {
    return `alert-${this.type}`
  }

  dismissOnTimeout() {
    if (this.lifetime > 0) {
      setTimeout(() => {
        this.close();
      }, this.lifetime)
    }
  }

  close() {
    this.onClose.emit(this)
  }
}
