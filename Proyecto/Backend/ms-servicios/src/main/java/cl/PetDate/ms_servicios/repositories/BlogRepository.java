package cl.PetDate.ms_servicios.repositories;

import cl.PetDate.ms_servicios.models.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BlogRepository extends MongoRepository<Blog, Long> {
    Page<Blog> findByIdServicio(Long idServicio, Pageable pageable);

    // Usado para la eliminación en cascada (política de retención de datos)
    void deleteByIdServicio(Long idServicio);
}
