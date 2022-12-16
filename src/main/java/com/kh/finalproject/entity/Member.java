package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.entity.enumurate.MemberRoleType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import jdk.jfr.Timestamp;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 회원 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "member")
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_index")
    private Long index;

    @Column(name = "member_id", nullable = false)
    private String id;

    @Column(name = "member_name", nullable = false)
    private String name;

    @Column(name = "member_pwd")
    private String password;

    @Column(name = "member_email", nullable = false)
    private String email;

    @Column(name = "member_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private MemberRoleType role;

    @Column(name = "member_point", nullable = false)
    private Integer point;

    @Column(name = "member_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    @Column(name = "member_reason")
    private String reason;

    @Column(name = "unregister_time")
    @Timestamp
    private LocalDateTime unregister;

    @OneToOne(mappedBy = "member")
    private Address address;

    @OneToMany(mappedBy = "member")
    private List<QnA> qnAList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<ReviewLike> reviewLikeList = new ArrayList<>();

    @OneToMany(mappedBy = "memberSuspect")
    private List<Accuse> accuseListSuspectList = new ArrayList<>();

    @OneToMany(mappedBy = "memberVictim")
    private List<Accuse> accuseListVictimList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<ReviewComment> reviewCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<MemberReserve> memberReserveList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<WishProduct> wishProductList = new ArrayList<>();

    // nullable 하면 회원가입이 안대서 지웠습니다.
    @Column(name = "member_accuse_count")
    private Integer memberAccuseCount;


    /**
     * Address 갱신 메서드
     */
    public void updateAddress(Address address) {
        this.address = address;
    }

    public Member toEntity(UnregisterDTO unregisterDTO){
        this.id = unregisterDTO.getId();
        this.password = unregisterDTO.getPassword();
        this.name = unregisterDTO.getName();
        this.address = unregisterDTO.getAddress();
        this.unregister = unregisterDTO.getUnregister();
        this.status = unregisterDTO.getMemberStatus();
        return this;
    };
    /*연관 메서드*/
    public void createAccuse(Accuse accuse){
        accuseListSuspectList.add(accuse);
        accuseListVictimList.add(accuse);
    }

    /**
     * @param signupDTO
     */
    public Member toEntity(SignupDTO signupDTO) {
        this.id = signupDTO.getId();
        this.password = signupDTO.getPassword();
        this.name = signupDTO.getName();
        this.email = signupDTO.getEmail();
        this.role = MemberRoleType.ROLE_USER;
        this.point = 0;
        this.status = MemberStatus.ACTIVE;
        this.memberAccuseCount = 0;

        return this;
    }

    /**
     * @param deleteMemberDTO
     */
    public Member changeMemberStatus(DeleteMemberDTO deleteMemberDTO) {
        this.id = deleteMemberDTO.getId();
        this.password = deleteMemberDTO.getPassword();
        this.status = MemberStatus.DELETE;
        this.unregister = LocalDateTime.now();

        return this;
    }

    public Member changeMemberStatus() {
        this.status = MemberStatus.UNREGISTER;

        return this;
    }

    /**
     * @param searchByIdDTO
     */
    public Member toEntity(SearchByIdDTO searchByIdDTO) {
        this.id = searchByIdDTO.getId();

        return this;
    }

    /**
     * @param editMemberInfoDTO
     */
    @CreatedBy
    public Member toEntity(EditMemberInfoDTO editMemberInfoDTO) {
        this.id = editMemberInfoDTO.getId();
        this.password = editMemberInfoDTO.getPassword();
        this.name = editMemberInfoDTO.getName();
        this.email = editMemberInfoDTO.getEmail();

        return this;
    }

    /**
     * 디버깅용 Member 생성 메서드
     */
    public Member createMember(String id, String name, String password, String email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = MemberRoleType.ROLE_USER;
        this.point = 0;
        this.status = MemberStatus.ACTIVE;

        return this;
    }

    public void updateMember(Address findAddress, EditMemberInfoDTO editMemberInfoDTO) {
        this.id = editMemberInfoDTO.getId();
        this.name = editMemberInfoDTO.getName();
        this.password = editMemberInfoDTO.getPassword();
        this.email = editMemberInfoDTO.getEmail();
        findAddress.updateAddress(editMemberInfoDTO);

        //양방향 연관관계 편의 메서드
        this.address = findAddress;
        findAddress.updateMember(this);
    }

    public void addMemberAccuseCount() {
        this.memberAccuseCount++;
    }

    public void updateBlackByCount() {
        this.reason = "신고 누적으로인한 블랙리스트 추가";
        this.status = MemberStatus.BLACKLIST;
    }
}