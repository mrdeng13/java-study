package com.tutorial.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DataController {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private ObjectMapper objectMapper;

    /** 统一数据接口：按命名导出返回对应 JSON（数组或对象） */
    @GetMapping("/data/{name}")
    public JsonNode getData(@PathVariable String name) {
        String json;
        try {
            json = jdbc.queryForObject(
                    "SELECT data FROM json_doc WHERE name = ?", String.class, name);
        } catch (EmptyResultDataAccessException e) {
            return objectMapper.createArrayNode();
        }
        if (json == null) {
            return objectMapper.createArrayNode();
        }
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("JSON 解析失败: " + name, e);
        }
    }

    /** 列出所有已加载的数据名 */
    @GetMapping("/data")
    public List<String> listNames() {
        return jdbc.queryForList("SELECT name FROM json_doc ORDER BY id", String.class);
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
