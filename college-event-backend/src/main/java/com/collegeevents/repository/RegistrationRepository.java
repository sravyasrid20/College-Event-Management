package com.collegeevents.repository;

import com.collegeevents.model.Event;
import com.collegeevents.model.Registration;
import com.collegeevents.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudent(User student);
    List<Registration> findByEvent(Event event);
    Optional<Registration> findByStudentAndEvent(User student, Event event);
    boolean existsByStudentAndEvent(User student, Event event);
    long countByEvent(Event event);
}
