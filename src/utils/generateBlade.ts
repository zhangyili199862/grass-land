import { Vector3 } from "three";

const BLADE_WIDTH = 0.1; // 草片的宽度
const TIPS_OFFSET = 0.1; // 草片顶端的偏移量，控制草片顶部的弯曲
const BLADE_HEIGHT_VARIATION = 0.6; // 草片高度的随机变化范围

/**
 * 生成草片的顶点位置、UV坐标和颜色数据
 *
 * @param center 草片底部的中心位置
 * @param vArrOffset 顶点数组的索引偏移量，用于生成索引
 * @param uv 纹理的UV坐标，用于在草片上进行纹理映射
 * @param baseHeight 草片的基础高度，最终高度在此基础上加入随机变化
 * @returns 包含草片顶点和索引的数据对象
 */
const generateBlade = (
  center: Vector3, // 草片底部中心的三维位置
  vArrOffset: number, // 顶点数组的索引偏移量
  uv: number[], // UV 坐标
  baseHeight: number // 基础高度
) => {
  // 草片中部的宽度是总宽度的一半
  const midWidth = BLADE_WIDTH * 0.5;

  // 顶端偏移，用来控制草片顶端轻微弯曲的效果
  const tipOffset = TIPS_OFFSET;

  // 随机生成草片的高度，在基础高度上加入随机变化
  const height = baseHeight + Math.random() * BLADE_HEIGHT_VARIATION;

  // 随机生成草片的朝向角度 (yaw)，让草片在地面上随机旋转
  const yaw = Math.random() * Math.PI * 2;
  const yawUnitVec = new Vector3(Math.sin(yaw), 0, -Math.cos(yaw)); // 旋转单位向量，决定草片的左右方向

  // 随机生成草片顶端的弯曲方向，让草片有些自然的弯曲效果
  const tipBend = Math.random() * Math.PI * 2;
  const tipBendUnitVec = new Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend)); // 弯曲方向的单位向量

  // 计算草片底部的左侧顶点 (bl)
  const bl = new Vector3().addVectors(
    center,
    yawUnitVec.clone().multiplyScalar(BLADE_WIDTH / 2) // 从中心向左偏移 BLADE_WIDTH/2
  );

  // 计算草片底部的右侧顶点 (br)
  const br = new Vector3().addVectors(
    center,
    yawUnitVec.clone().multiplyScalar(-BLADE_WIDTH / 2) // 从中心向右偏移 BLADE_WIDTH/2
  );

  // 计算草片中间左侧的顶点 (tl)，高度增加一半
  const tl = new Vector3()
    .addVectors(center, yawUnitVec.clone().multiplyScalar(midWidth / 2)) // 水平偏移 midWidth/2
    .setY(height / 2); // 提升 Y 轴高度

  // 计算草片中间右侧的顶点 (tr)，高度增加一半
  const tr = new Vector3()
    .addVectors(center, yawUnitVec.clone().multiplyScalar(-midWidth / 2)) // 水平偏移 -midWidth/2
    .setY(height / 2); // 提升 Y 轴高度

  // 计算草片顶端中心的顶点 (tc)，包含轻微的顶端弯曲
  const tc = new Vector3()
    .addVectors(center, tipBendUnitVec.clone().multiplyScalar(tipOffset)) // 顶端轻微偏移
    .setY(height); // 设置 Y 轴高度为草片的总高度

  // 定义顶点的颜色，底部为黑色，中部为灰色，顶端为白色
  const black = [0, 0, 0];
  const gray = [0.5, 0.5, 0.5];
  const white = [1, 1, 1];

  // 将顶点及其 UV 坐标、颜色添加到数组中
  const verts = [
    { pos: bl.toArray(), uv, color: black }, // 底部左侧顶点
    { pos: br.toArray(), uv, color: black }, // 底部右侧顶点
    { pos: tl.toArray(), uv, color: gray },  // 中部左侧顶点
    { pos: tr.toArray(), uv, color: gray },  // 中部右侧顶点
    { pos: tc.toArray(), uv, color: white }, // 顶端中心顶点
  ];

  // 返回顶点数组和用于构建三角形的索引数组
  return {
    verts: verts, // 顶点数组
    indices: [
      // 定义连接顶点的索引，以构建三角形面
      vArrOffset,     // 左下角 (bl)
      vArrOffset + 1, // 右下角 (br)
      vArrOffset + 2, // 左上角 (tl)

      vArrOffset + 1, // 右下角 (br)
      vArrOffset + 3, // 右上角 (tr)
      vArrOffset + 2, // 左上角 (tl)

      vArrOffset + 2, // 左上角 (tl)
      vArrOffset + 3, // 右上角 (tr)
      vArrOffset + 4, // 顶端 (tc)
    ],
  };
};

export default generateBlade;
