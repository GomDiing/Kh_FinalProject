package com.kh.finalproject.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

/**
 * 생성/수정 시간 갱신 엔티티 클래스
 * 이 클래스를 상속받은 엔티티 클래스가 쿼리를 전송 시
 * insert하면 자동으로 create_time 컬럼을 생성해서 생성 시간을
 * update하면 자동으로 update_time 컬럼을 생성해서 수정 시간을 입력
 * 단, 이 클래스를 상속받은 클래스는 @Builder 사용 시 주의, 되도록 생성자 사용 권장
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseTimeEntity {
    //생성시간
    @CreatedDate
    @JsonProperty("create_time")
    protected LocalDateTime createTime;

    //수정시간
    @LastModifiedDate
    @JsonProperty("update_time")
    protected  LocalDateTime updateTime;
}
