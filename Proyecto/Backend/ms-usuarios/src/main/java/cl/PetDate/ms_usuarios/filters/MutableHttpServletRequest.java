package cl.PetDate.ms_usuarios.filters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.*;

public class MutableHttpServletRequest extends HttpServletRequestWrapper {

    private final Map<String, String> extraHeaders = new HashMap<>();

    public MutableHttpServletRequest(HttpServletRequest request) {
        super(request);
    }

    public void addHeader(String name, String value) {
        extraHeaders.put(name.toLowerCase(), value);
    }

    @Override
    public String getHeader(String name) {
        String extra = extraHeaders.get(name.toLowerCase());
        return extra != null ? extra : super.getHeader(name);
    }

    @Override
    public Enumeration<String> getHeaders(String name) {
        String extra = extraHeaders.get(name.toLowerCase());
        if (extra != null) {
            return Collections.enumeration(List.of(extra));
        }
        return super.getHeaders(name);
    }

    @Override
    public Enumeration<String> getHeaderNames() {
        Set<String> names = new HashSet<>(extraHeaders.keySet());
        Enumeration<String> original = super.getHeaderNames();
        if (original != null) {
            while (original.hasMoreElements()) {
                names.add(original.nextElement().toLowerCase());
            }
        }
        return Collections.enumeration(names);
    }
}
