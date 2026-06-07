package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.BlogRequest;
import cl.PetDate.ms_servicios.dto.BlogResponse;
import cl.PetDate.ms_servicios.exceptions.BlogNotFoundException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Blog;
import cl.PetDate.ms_servicios.repositories.BlogRepository;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

@Service
public class BlogService {

    private static final Logger log = LoggerFactory.getLogger(BlogService.class);
    private static final String SEQUENCE_NAME = "blogs_sequence";

    private final BlogRepository blogRepository;
    private final ServicioRepository servicioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public BlogService(
            BlogRepository blogRepository,
            ServicioRepository servicioRepository,
            SequenceGeneratorService sequenceGeneratorService) {
        this.blogRepository = blogRepository;
        this.servicioRepository = servicioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public BlogResponse crearBlog(BlogRequest request) {
        if (servicioRepository.findById(request.getIdServicio()).isEmpty()) {
            throw new ServicioNotFoundException(request.getIdServicio());
        }
        Blog blog = toEntity(request);
        blog.setIdBlog(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        blog.setFecha(LocalDateTime.now());
        log.info("Creando entrada de blog para servicio id={}", request.getIdServicio());
        return toResponse(blogRepository.save(blog));
    }

    public Page<BlogResponse> listarBlogs(Pageable pageable) {
        return blogRepository.findAll(pageable).map(this::toResponse);
    }

    public BlogResponse buscarPorId(Long id) {
        return blogRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new BlogNotFoundException(id));
    }

    public Page<BlogResponse> buscarPorServicio(Long idServicio, Pageable pageable) {
        return blogRepository.findByIdServicio(idServicio, pageable)
                .map(this::toResponse);
    }

    public BlogResponse actualizarBlog(Long id, BlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));
        blog.setTitulo(request.getTitulo());
        blog.setTexto(request.getTexto());
        log.info("Actualizando blog id={}", id);
        return toResponse(blogRepository.save(blog));
    }

    public void eliminarBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));
        blogRepository.delete(blog);
        log.info("Blog id={} eliminado", id);
    }

    // Usado para la eliminación en cascada al eliminar un servicio (política de retención de datos)
    public void eliminarPorServicio(Long idServicio) {
        blogRepository.deleteByIdServicio(idServicio);
        log.info("Blogs del servicio id={} eliminados en cascada", idServicio);
    }

    public BlogResponse subirImagen(Long id, MultipartFile imagen) throws IOException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));

        // Crea el directorio si no existe (volumen compartido del servidor de imagenes)
        String uploadDir = "/app/uploads/blogs/";
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        // Nombre unico para evitar colisiones
        String extension = StringUtils.getFilenameExtension(imagen.getOriginalFilename());
        String nombreArchivo = "blog_" + id + "_" + System.currentTimeMillis() + "." + extension;
        Path rutaArchivo = dirPath.resolve(nombreArchivo);

        // Eliminar imagen anterior si existe
        if (blog.getImagen() != null) {
            Path anterior = Paths.get("/app/uploads/blogs/",
                    blog.getImagen().replace("/uploads/blogs/", ""));
            Files.deleteIfExists(anterior);
        }

        // Guardar el archivo en el volumen compartido
        Files.copy(imagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        // Guardar solo la URL relativa (servida por el servidor de imagenes via gateway)
        blog.setImagen("/uploads/blogs/" + nombreArchivo);
        log.info("Imagen actualizada para blog id={}", id);
        return toResponse(blogRepository.save(blog));
    }

    private Blog toEntity(BlogRequest r) {
        Blog b = new Blog();
        b.setIdServicio(r.getIdServicio());
        b.setTitulo(r.getTitulo());
        b.setTexto(r.getTexto());
        return b;
    }

    private BlogResponse toResponse(Blog b) {
        BlogResponse r = new BlogResponse();
        r.setIdBlog(b.getIdBlog());
        r.setIdServicio(b.getIdServicio());
        r.setTitulo(b.getTitulo());
        r.setFecha(b.getFecha());
        r.setTexto(b.getTexto());
        r.setImagen(b.getImagen());
        return r;
    }
}
