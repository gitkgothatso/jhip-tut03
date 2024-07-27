package com.jhiptut.third.domain;

import static com.jhiptut.third.domain.TodoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.jhiptut.third.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TodoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Todo.class);
        Todo todo1 = getTodoSample1();
        Todo todo2 = new Todo();
        assertThat(todo1).isNotEqualTo(todo2);

        todo2.setId(todo1.getId());
        assertThat(todo1).isEqualTo(todo2);

        todo2 = getTodoSample2();
        assertThat(todo1).isNotEqualTo(todo2);
    }
}
