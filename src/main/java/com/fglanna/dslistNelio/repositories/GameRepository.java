package com.fglanna.dslistNelio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fglanna.dslistNelio.entities.Game;

public interface GameRepository extends JpaRepository<Game, Long> {

}
