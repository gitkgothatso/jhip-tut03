package com.jhiptut.third.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TodoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Todo getTodoSample1() {
        return new Todo().id(1L).title("title1").description("description1");
    }

    public static Todo getTodoSample2() {
        return new Todo().id(2L).title("title2").description("description2");
    }

    public static Todo getTodoRandomSampleGenerator() {
        return new Todo().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
