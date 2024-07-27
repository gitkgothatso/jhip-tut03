import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITodo } from '../todo.model';
import { TodoService } from '../service/todo.service';

@Component({
  standalone: true,
  templateUrl: './todo-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TodoDeleteDialogComponent {
  todo?: ITodo;

  protected todoService = inject(TodoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.todoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
