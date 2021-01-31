package com.andreeagrosu.urbanBikes.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SignUpRequest {

    @NotBlank(message = "Name must be valid")
    private String name;

    @NotBlank(message = "Email must be valid")
    @Email(message = "Email must be valid format")
    private String email;

    @NotBlank(message = "Password must be at least 4 characters")
    @Size(min = 4, max = 15, message = "Password must be at least 4 characters and max 15 characters")
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
