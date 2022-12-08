package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository <Notice,Long>{
    List<Notice> findByIndex(Long index);
}
