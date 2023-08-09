package com.dutaduta.sketchme.reservation.config;


import com.dutaduta.sketchme.reservation.constant.KafkaConstants;
import com.dutaduta.sketchme.reservation.domain.Meeting;
import com.dutaduta.sketchme.reservation.dto.MessageDTO;
import jakarta.persistence.EntityManagerFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.kafka.KafkaItemWriter;
import org.springframework.batch.item.kafka.builder.KafkaItemWriterBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Collections;

@Slf4j
@Configuration
public class SendMessageBeforeTenMinuteJobConfiguration {

    private final EntityManagerFactory emf;
    private final KafkaTemplate<String, MessageDTO> kafkaTemplate;

    public SendMessageBeforeTenMinuteJobConfiguration(EntityManagerFactory emf,
                                                      KafkaTemplate<String, MessageDTO> kafkaTemplate) {
        this.emf = emf;
        this.kafkaTemplate = kafkaTemplate;
        kafkaTemplate.setDefaultTopic(KafkaConstants.KAFKA_TOPIC);
    }

    @Bean
    public Job messageBeforeTenMinute(JobRepository jobRepository, Step step) {
        return new JobBuilder("sendMessageBeforeTenMinuteJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(step)
                .build();
    }

    @Bean
    public Step step(JobRepository jobRepository, PlatformTransactionManager pm) {
        return new StepBuilder("step", jobRepository)
                .<Meeting, MessageDTO>chunk(1000, pm)
                .reader(reader())
                .processor(processor())
                .writer(kafkaItemWriter(kafkaTemplate))
                .build();
    }


    @Bean
    @StepScope
    public JpaPagingItemReader<Meeting> reader() {
        LocalDateTime current = LocalDateTime.now();
        int time = current.getMinute();
        if (time < 30) time = 0;
        else time = 30;

        LocalDateTime targetDateTime = LocalDateTime.of(current.getYear(),
                current.getMonth(),
                current.getDayOfMonth(),
                current.getHour(),
                time);

        return new JpaPagingItemReaderBuilder<Meeting>() //list
                .name("reader")
                .entityManagerFactory(emf)
                .pageSize(1000)
                .queryString("SELECT m FROM Meeting m WHERE m.startDateTime = :targetDateTime") //여기 바꿔야 함.
                .parameterValues(Collections.<String, Object>singletonMap("targetDateTime", targetDateTime))
                .build();
    }

    @Bean
    public ItemProcessor<Meeting, MessageDTO> processor() {
        return meeting -> {
            MessageDTO messageDTO = MessageDTO.toDTO(meeting);
            if (messageDTO == null) return null;
            return messageDTO;
        };
    }

    @Bean
    public KafkaItemWriter<String, MessageDTO> kafkaItemWriter(KafkaTemplate<String, MessageDTO> kafkaTemplate) {
        return new KafkaItemWriterBuilder<String, MessageDTO>()
                .kafkaTemplate(kafkaTemplate)
                .itemKeyMapper(source -> source.getSenderID().toString())
                .build();
    }
}
