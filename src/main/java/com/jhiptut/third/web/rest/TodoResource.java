package com.jhiptut.third.web.rest;

import com.jhiptut.third.domain.Todo;
import com.jhiptut.third.repository.TodoRepository;
import com.jhiptut.third.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jhiptut.third.domain.Todo}.
 */
@RestController
@RequestMapping("/api/todos")
@Transactional
public class TodoResource {

    private final Logger log = LoggerFactory.getLogger(TodoResource.class);

    private static final String ENTITY_NAME = "todo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodoRepository todoRepository;

    public TodoResource(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * {@code POST  /todos} : Create a new todo.
     *
     * @param todo the todo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todo, or with status {@code 400 (Bad Request)} if the todo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) throws URISyntaxException {
        log.debug("REST request to save Todo : {}", todo);
        if (todo.getId() != null) {
            throw new BadRequestAlertException("A new todo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        todo = todoRepository.save(todo);
        return ResponseEntity.created(new URI("/api/todos/" + todo.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, todo.getId().toString()))
            .body(todo);
    }

    /**
     * {@code PUT  /todos/:id} : Updates an existing todo.
     *
     * @param id the id of the todo to save.
     * @param todo the todo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todo,
     * or with status {@code 400 (Bad Request)} if the todo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Todo todo)
        throws URISyntaxException {
        log.debug("REST request to update Todo : {}, {}", id, todo);
        if (todo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        todo = todoRepository.save(todo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todo.getId().toString()))
            .body(todo);
    }

    /**
     * {@code PATCH  /todos/:id} : Partial updates given fields of an existing todo, field will ignore if it is null
     *
     * @param id the id of the todo to save.
     * @param todo the todo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todo,
     * or with status {@code 400 (Bad Request)} if the todo is not valid,
     * or with status {@code 404 (Not Found)} if the todo is not found,
     * or with status {@code 500 (Internal Server Error)} if the todo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Todo> partialUpdateTodo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Todo todo
    ) throws URISyntaxException {
        log.debug("REST request to partial update Todo partially : {}, {}", id, todo);
        if (todo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Todo> result = todoRepository
            .findById(todo.getId())
            .map(existingTodo -> {
                if (todo.getTitle() != null) {
                    existingTodo.setTitle(todo.getTitle());
                }
                if (todo.getDescription() != null) {
                    existingTodo.setDescription(todo.getDescription());
                }

                return existingTodo;
            })
            .map(todoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todo.getId().toString())
        );
    }

    /**
     * {@code GET  /todos} : get all the todos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todos in body.
     */
    @GetMapping("")
    public List<Todo> getAllTodos(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Todos");
        if (eagerload) {
            return todoRepository.findAllWithEagerRelationships();
        } else {
            return todoRepository.findAll();
        }
    }

    /**
     * {@code GET  /todos/:id} : get the "id" todo.
     *
     * @param id the id of the todo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodo(@PathVariable("id") Long id) {
        log.debug("REST request to get Todo : {}", id);
        Optional<Todo> todo = todoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(todo);
    }

    /**
     * {@code DELETE  /todos/:id} : delete the "id" todo.
     *
     * @param id the id of the todo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable("id") Long id) {
        log.debug("REST request to delete Todo : {}", id);
        todoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
