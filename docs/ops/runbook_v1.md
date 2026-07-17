# 运维手册 v1｜链哨 AI

## 服务清单

| 服务 | 端口 | 健康检查 |
|------|------|----------|
| web | 3000 | `GET /` 或 `/health` |
| admin | 3001 | `/health` |
| api | 4000 | `/health` · `/api/v1/system/readiness` |
| bot | 4001 | `/health` |
| worker | — | 日志心跳 |
| postgres | 127.0.0.1:5432 | `pg_isready` |
| redis | 127.0.0.1:6379 | `redis-cli ping` |

## 本地启动

```bash
pnpm install
pnpm dev
# 可选基础设施
docker compose up -d postgres redis
```

## 生产启动闸门

```bash
export CHAINVIGIL_RUNTIME_MODE=production
# 必须：HTTPS URL、ADMIN 密码、INTERNAL_WRITE_SECRET、
# TELEGRAM_*、DATABASE_URL、REDIS_URL、主链 RPC、数据源 key
# assertProductionRuntime() 会在 api/bot 启动时 fail-closed
```

## 发布检查清单

- [ ] `pnpm typecheck && pnpm test && pnpm build`  
- [ ] `pnpm db:validate`  
- [ ] readiness `productionSecurity.ok`  
- [ ] Admin 密码非空且 ≥16  
- [ ] CORS 仅业务域名  
- [ ] TRUST_PROXY 与反代 hops 一致  
- [ ] Telegram webhook secret 已配置  
- [ ] 报告接口返回 `mode` / `confidence`  
- [ ] 密钥不在仓库、不在前端 `NEXT_PUBLIC_*`  

## 事故分级

| 级 | 例子 | 动作 |
|----|------|------|
| P0 | 密钥泄露、生产无鉴权写 | 轮换密钥、下线写接口、公告 |
| P1 | 误报大规模、RPC 全挂 | 降级 mock 标记、切备份 RPC |
| P2 | 限流误伤 | 调阈值、查 trustProxy |
| P3 | UI 文案 | 下个迭代 |

## 备份

- Postgres：日备（上生产后）  
- 不备份：mock 内存限流状态  
- Redis：可重建，注意限流短暂失效  

## 监控最小集

1. `/health` 5xx  
2. 429 比率  
3. 外部 provider 错误率  
4. 磁盘与容器重启次数  
