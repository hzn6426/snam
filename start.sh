#!/bin/bash

# Umi 4 升级后首次启动脚本
# 使用方法: bash start.sh

echo "=========================================="
echo "  Umi 4 + Antd 6.2.1 + React 18"
echo "  首次启动脚本"
echo "=========================================="
echo ""

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误: Node.js 版本过低 (当前: $(node -v))"
    echo "   需要: Node.js >= 16.0.0"
    echo "   请升级 Node.js 后重试"
    exit 1
fi
echo "✅ Node.js 版本检查通过: $(node -v)"
echo ""

# 清理旧依赖
echo "🧹 清理旧依赖..."
if [ -d "node_modules" ]; then
    echo "   删除 node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "   删除 package-lock.json..."
    rm -f package-lock.json
fi

if [ -f "yarn.lock" ]; then
    echo "   删除 yarn.lock..."
    rm -f yarn.lock
fi
echo "✅ 清理完成"
echo ""

# 清理 Umi 缓存
echo "🧹 清理 Umi 缓存..."
if [ -d ".umi" ]; then
    echo "   删除 .umi..."
    rm -rf .umi
fi

if [ -d ".umi-production" ]; then
    echo "   删除 .umi-production..."
    rm -rf .umi-production
fi
echo "✅ 缓存清理完成"
echo ""

# 安装依赖
echo "📦 安装依赖..."
echo "   这可能需要几分钟时间，请耐心等待..."
echo ""

if command -v yarn &> /dev/null; then
    echo "   使用 yarn 安装..."
    yarn install
else
    echo "   使用 npm 安装..."
    npm install
fi

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 依赖安装失败"
    echo "   请检查网络连接或尝试手动安装: npm install"
    exit 1
fi

echo ""
echo "✅ 依赖安装完成"
echo ""

# 显示启动信息
echo "=========================================="
echo "  ✨ 准备就绪！"
echo "=========================================="
echo ""
echo "📚 快速指南:"
echo "   - 查看升级说明: cat README_UPGRADE.md"
echo "   - 查看详细指南: cat UMI4_MIGRATION_GUIDE.md"
echo "   - 查看快速启动: cat UPGRADE_COMPLETE.md"
echo ""
echo "🚀 启动命令:"
echo "   开发环境: npm start"
echo "   生产构建: npm run build"
echo ""
echo "⚠️  注意事项:"
echo "   1. 首次启动可能较慢，请耐心等待"
echo "   2. 如遇问题，请查看文档或清除缓存重试"
echo "   3. 建议使用 Chrome >= 80 浏览器"
echo ""

# 询问是否立即启动
read -p "是否立即启动开发服务器? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 启动开发服务器..."
    echo ""
    npm start
fi

