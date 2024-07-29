package com.jhiptut.third.repository;

import com.jhiptut.third.domain.Todo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Todo entity.
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Query("select todo from Todo todo where todo.ownedBy.login = ?#{authentication.name}")
    List<Todo> findByOwnedByIsCurrentUser();

    default Optional<Todo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Todo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Todo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select todo from Todo todo left join fetch todo.ownedBy", countQuery = "select count(todo) from Todo todo")
    Page<Todo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select todo from Todo todo left join fetch todo.ownedBy")
    List<Todo> findAllWithToOneRelationships();

    @Query("select todo from Todo todo left join fetch todo.ownedBy where todo.id =:id")
    Optional<Todo> findOneWithToOneRelationships(@Param("id") Long id);
}
