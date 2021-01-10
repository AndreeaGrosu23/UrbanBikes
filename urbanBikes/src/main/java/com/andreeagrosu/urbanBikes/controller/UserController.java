package com.andreeagrosu.urbanBikes.controller;

import com.andreeagrosu.urbanBikes.exception.ResourceNotFoundException;
import com.andreeagrosu.urbanBikes.model.User;
import com.andreeagrosu.urbanBikes.repository.UserRepository;
import com.andreeagrosu.urbanBikes.security.CurrentUser;
import com.andreeagrosu.urbanBikes.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//The UserController class contains a protected API to get the details of the currently authenticated user
@RestController
public class UserController {

    private UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
