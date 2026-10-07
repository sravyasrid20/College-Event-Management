package com.collegeevents.config;

import com.collegeevents.security.JwtFilter;
import com.collegeevents.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/hello").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events").permitAll()
                .requestMatchers("/api/events/pending").hasRole("ADMIN")
                .requestMatchers("/api/events/*/approve", "/api/events/*/reject").hasRole("ADMIN")
                .requestMatchers("/api/events/my").hasRole("ORGANIZER")
                .requestMatchers(HttpMethod.POST, "/api/events").hasRole("ORGANIZER")
                .requestMatchers(HttpMethod.PUT, "/api/events/*").hasRole("ORGANIZER")
                .requestMatchers(HttpMethod.DELETE, "/api/events/*").hasRole("ORGANIZER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/gemini/**").permitAll()
                .requestMatchers("/api/groq/**").authenticated()
                .requestMatchers("/api/registrations/my").hasRole("STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/registrations/**").hasRole("STUDENT")
                .requestMatchers(HttpMethod.DELETE, "/api/registrations/**").hasRole("STUDENT")
                .requestMatchers("/api/registrations/event/**").hasAnyRole("ADMIN", "ORGANIZER")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
