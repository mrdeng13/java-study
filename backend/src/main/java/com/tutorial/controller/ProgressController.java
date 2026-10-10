package com.tutorial.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProgressController {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private ObjectMapper objectMapper;

    /** 写进度所需的口令（在 application.properties 里配置 app.passcode）。
     *  留空则不做口令校验（不推荐，任何人都能写）。 */
    @Value("${app.passcode:}")
    private String passcode;

    /** 启动即确保表存在，免去手动建表 */
    @PostConstruct
    public void initTable() {
        jdbc.execute("CREATE TABLE IF NOT EXISTS user_progress (" +
                "user VARCHAR(64) NOT NULL PRIMARY KEY, " +
                "data LONGTEXT, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
    }

    /** 读取某用户的进度；无记录返回 {} */
    @GetMapping("/progress")
    public JsonNode getProgress(@RequestParam("user") String user) {
        try {
            String json = jdbc.queryForObject(
                    "SELECT data FROM user_progress WHERE user = ?", String.class, user);
            if (json == null) return objectMapper.createObjectNode();
            return objectMapper.readTree(json);
        } catch (EmptyResultDataAccessException e) {
            return objectMapper.createObjectNode();
        } catch (Exception e) {
            return objectMapper.createObjectNode();
        }
    }

    /** 保存某用户的进度（需口令）。data 为前端整份 store 的 JSON 字符串。 */
    @PostMapping("/progress")
    public Map<String, Object> saveProgress(@RequestParam("user") String user,
                                            @RequestParam(value = "passcode", required = false) String passcode,
                                            @RequestBody String body) {
        Map<String, Object> resp = new LinkedHashMap<>();
        // 口令校验
        if (this.passcode != null && !this.passcode.isEmpty()) {
            if (passcode == null || !this.passcode.equals(passcode)) {
                resp.put("ok", false);
                resp.put("error", "口令错误");
                return resp;
            }
        }
        // 校验 body 是合法 JSON，避免脏数据进库
        try {
            objectMapper.readTree(body);
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("error", "进度数据不是合法 JSON");
            return resp;
        }
        jdbc.update("INSERT INTO user_progress (user, data) VALUES (?, ?) " +
                "ON DUPLICATE KEY UPDATE data = VALUES(data)", user, body);
        resp.put("ok", true);
        return resp;
    }
}
