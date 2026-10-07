package com.collegeevents.repository;

import com.collegeevents.model.Event;
import com.collegeevents.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(Event.Status status);
    List<Event> findByOrganizer(User organizer);
    List<Event> findByOrganizerAndStatus(User organizer, Event.Status status);
}
