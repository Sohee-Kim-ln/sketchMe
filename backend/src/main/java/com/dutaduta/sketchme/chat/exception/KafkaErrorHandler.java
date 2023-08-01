//package com.dutaduta.sketchme.chat.exception;
//
//import lombok.AllArgsConstructor;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.apache.kafka.clients.consumer.Consumer;
//import org.apache.kafka.clients.consumer.ConsumerRecord;
//import org.apache.kafka.clients.consumer.OffsetAndMetadata;
//import org.apache.kafka.common.TopicPartition;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.listener.KafkaListenerErrorHandler;
//import org.springframework.kafka.listener.ListenerExecutionFailedException;
//import org.springframework.messaging.Message;
//import org.springframework.stereotype.Component;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Slf4j
//@Component
//@AllArgsConstructor
//public class KafkaErrorHandler implements KafkaListenerErrorHandler {
//
//    private final KafkaTemplate<String, String> kafkaTemplate;
//
//    private static String DEAD_TOPIC_NAME = "dev-dead-topic";
//
//    @Override
//    public Object handleError(Message<?> message, ListenerExecutionFailedException exception) {
//        return null;
//    }
//
//    /**
//     * kafka error 발생 시 처리
//     *
//     * <kafka error 발생 시 처리 방법>
//     * 에러 발생 시 로그를 기록하거나 error처리를 위한 kafka topic으로 재전송하는 동작을 할 수 있습니다.
//     *
//     * @param message
//     * @param exception
//     * @param consumer
//     * @return
//     */
//    @Override
//    public Object handleError(Message<?> message, ListenerExecutionFailedException exception, Consumer<?, ?> consumer) {
//        /**
//         * error 로그 기록
//         */
//        log.error("[KafkaErrorHandler] kafkaMessage=["
//                + message.getPayload() + "], errorMessage=[" + exception.getMessage() + "]");
//
//        /**
//         * 1) 원하는 메시지 값을 뽑아서 비교 처리나 조건 처리를 할 수도 있습니다.
//         * 2) 혹은 원하는 내용만 error 로그로 기록할 수 있습니다.
//         * 3) 혹은 실패 메시지 kafka topic으로 재전송 (실패 메시지를 처리할 dead topic을 별도로 생성해놓고 실패 메시지를 전송하여 처리하도록 합니다.)
//         */
//        ConsumerRecord<String, String> record = (ConsumerRecord<String, String>) message.getPayload();
//
//        // 1) 원하는 메시지 값을 뽑아서 비교 처리나 조건 처리를 할 수도 있습니다.
//        if (record.key() == "my key") {
//            // 처리
//        }
//        // 2) 혹은 원하는 내용만 error 로그로 기록할 수 있습니다.
//        log.error("[KafkaErrorHandler] topic=[" + record.topic() + "], value=[" + record.value() + "]");
//        // 3) 혹은 실패 메시지 kafka topic으로 재전송 (실패 메시지를 처리할 dead topic을 별도로 생성해놓고 실패 메시지를 전송하여 처리하도록 합니다.)
////        kafkaTemplate.send(KafkaConstants.KAFKA_DEAD_TOPIC, record.value());
//        Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
//        offsets.put(
//                new TopicPartition(record.topic(), record.partition()),
//                new OffsetAndMetadata(record.offset() + 1, null));
//        consumer.commitSync(offsets); // offset commit. (메시지 처리한 곳 표시해줌.)
//        return null;
//    }
//}