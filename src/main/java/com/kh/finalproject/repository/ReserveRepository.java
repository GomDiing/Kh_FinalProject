package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Reserve;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReserveRepository extends JpaRepository<Reserve, Long> {

    Optional<List<Reserve>> findAllByCreateTimeBeforeAndStatus(LocalDateTime now, ReserveStatus status);
    Optional<List<Reserve>> findAllByCreateTimeBefore(LocalDateTime now);

    Optional<List<Reserve>> findAllByTicketAndStatus(String ticket, ReserveStatus status);

    Optional<Reserve> findByTicket(String ticket);

    Optional<List<Reserve>> findAllByMemberAndStatusIn(Member member, List<ReserveStatus> reserveStatus);
    Optional<List<Reserve>> findAllByMemberAndStatus(Member member, ReserveStatus status);

//    @Query("select new com.kh.finalproject.dto.reserve.SearchAllReserveDTO() from Reserve r, Member m where ")
//    List<SearchAllReserveDTO> searchAllReserveListDTO(Long memberIndex);

    Integer countByTicket(String ticket);

    @Query("select sum(r.finalAmount) from Reserve r where r.ticket like :ticket")
    Integer sumByTicket(@Param("ticket") String ticket);
}
