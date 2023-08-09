package com.dutaduta.sketchme.reservation.config;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
@AllArgsConstructor
public class SendMessageBeforeTenMinuteScheduleConfiguration {

    private final JobLauncher jobLauncher;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager pm;
    private final SendMessageBeforeTenMinuteJobConfiguration config;

    @Scheduled(cron = "0/10 * * * * *")
    public void perform() throws Exception {
        JobParameters param = new JobParametersBuilder()
                .addString("sendMessageBeforeTenMinuteJob", String.valueOf(System.currentTimeMillis()))
                .toJobParameters();
        JobExecution jobExecution = jobLauncher.run(
                config.messageBeforeTenMinute(jobRepository,config.step(jobRepository, pm)),param);
    }
}
