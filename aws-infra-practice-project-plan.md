# AWS Infra Practice Project — เอกสารบริบทโปรเจกต์ฉบับเต็ม

> **หมายเหตุถึง Claude (หรือ AI ตัวไหนก็ตามที่มาอ่านไฟล์นี้):** ไฟล์นี้คือบริบททั้งหมดของโปรเจกต์ ผู้ใช้เป็นนักศึกษาปี 3 วิศวกรรมคอมพิวเตอร์ กำลังทำโปรเจกต์นี้เพื่อใช้เป็น portfolio สมัครฝึกงานสาย Cloud/Solutions Architect กรุณาอ่านทั้งไฟล์ก่อนช่วยเหลือใด ๆ โดยเฉพาะ**หมวด "นโยบายการใช้ AI"** เพราะมีกฎชัดเจนว่าช่วยแบบไหนได้ แบบไหนห้าม

---

## 1. บริบทและเป้าหมาย

### 1.1 ผู้ทำโปรเจกต์
- นักศึกษาปี 3 เทอม 1 คณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์
- กำลังเรียนคอร์ส AWS Solutions Architect Associate (Adrian Cantrill) ควบคู่ไปด้วย
- เป้าหมายอาชีพ: ฝึกงานสาย Cloud/Solutions Architect (เอียงไปทาง infrastructure มากกว่า software dev ทั่วไป)

### 1.2 ทำไมต้องมีโปรเจกต์นี้
- Deadline สมัครฝึกงานของมหาวิทยาลัย: กุมภาพันธ์ 2027
- บริษัทเป้าหมาย (KBTG, SCB TechX, Agoda, True Digital ฯลฯ) เปิดรับสมัครช่วงตุลาคม 2026 – มกราคม 2027
- ตลาดงานปี 2026 คาดหวังทั้ง (ก) พื้นฐาน infra ที่แน่น (ข) โปรเจกต์ที่จับต้องได้และอธิบายได้ลึก (ค) ความสามารถใช้ AI tool อย่างมีวิจารณญาณ — **ไม่ใช่แค่ใบเซอร์อย่างเดียว**
- ตัดสินใจแล้วว่า **1 โปรเจกต์ที่เข้าใจลึกจริง ดีกว่าหลายโปรเจกต์ตื้น ๆ ที่ AI ทำให้ทั้งหมด** เพราะ interviewer จะถามลึกจนจับได้ทันทีว่าใครเข้าใจจริง

### 1.3 เป้าหมายที่ต้องการเห็นผลจริง (Definition of Done)
โปรเจกต์นี้ถือว่า "เสร็จ" เมื่อทำสิ่งเหล่านี้ได้ทั้งหมด:
1. เข้าเว็บ/เรียก API ผ่าน ALB DNS แล้วใช้งานได้จริง (ไม่ใช่แค่รันบนเครื่องตัวเอง)
2. ทั้งระบบ provision ขึ้นมาใหม่ได้ด้วยคำสั่ง `terraform apply` เพียงคำสั่งเดียว (หลังตั้งค่าเริ่มต้นเสร็จ)
3. push โค้ดขึ้น GitHub แล้ว pipeline รัน build + deploy ให้อัตโนมัติ
4. อธิบายได้ทุกจุดว่า "ทำไมออกแบบแบบนี้" โดยไม่ต้องเปิดดูโค้ด
5. ตอบคำถามเชิงลึกได้ (ดูหมวดคำถามเตรียมสัมภาษณ์ด้านล่าง) โดยไม่ต้องเปิด AI ช่วย
6. มี README ที่อธิบาย architecture, decision, วิธีรัน, cost consideration ครบ
7. `terraform destroy` แล้ว provision ใหม่ได้อีกโดยไม่มีปัญหา (พิสูจน์ว่า infra เป็น code จริง ไม่ใช่ click-ops)

### 1.4 สิ่งที่ **ไม่ใช่** เป้าหมายของโปรเจกต์นี้
- ไม่ได้ต้องการ UI/UX ที่สวยงาม (ไม่มี frontend เลยด้วยซ้ำ — ดูหมวด 3)
- ไม่ได้ต้องการ feature เยอะ ๆ ในตัวแอป (แอปแค่เป็น "ตัวโหลด" ให้มีอะไรให้ deploy)
- ไม่ได้ต้องการทำ multi-region หรือ production-grade เต็มรูปแบบ — เป้าหมายคือ MVP ที่ถูกต้องตามหลักการ ไม่ใช่ระบบใหญ่โต

---

## 2. Tech Stack ที่เลือกใช้ทั้งหมด และเหตุผล

| ส่วนประกอบ | เทคโนโลยีที่เลือก | เหตุผลที่เลือก |
|---|---|---|
| Infrastructure as Code | **Terraform** | เป็นเครื่องมือ IaC ที่ตลาดงานไทยต้องการมากที่สุด รองรับหลาย cloud provider ไม่ผูกกับ AWS อย่างเดียวเหมือน CloudFormation |
| Compute | **EC2 + Auto Scaling Group** | เลือกแทน ECS Fargate เพราะต้องการเรียนรู้ infra แบบคุมเองเต็ม ๆ (patching, AMI, user-data, systemd) ไม่ใช่แค่ container orchestration ระดับสูง |
| Containerization | **Docker (เขียน Dockerfile เอง)** | ต้องการเข้าใจ containerization จริง ไม่ใช้ Dockerfile สำเร็จรูปจาก repo ต้นทาง |
| Database | **Amazon RDS (PostgreSQL)** | มาตรฐานที่ใช้จริงในงาน relational database managed service |
| Load Balancer | **Application Load Balancer (ALB)** | กระจาย traffic ไปยัง EC2 หลายตัว พร้อม health check |
| Container Registry | **Amazon ECR** | เก็บ Docker image ที่ build แล้ว ผูกสิทธิ์กับ IAM ได้ |
| CI/CD | **GitHub Actions** | ฟรี ใช้งานง่าย ผูกกับ GitHub repo ได้ตรง ๆ ตลาดงานต้องการ |
| Networking | **Custom VPC** (ไม่ใช้ default VPC) | ต้องออกแบบเองเพื่อเข้าใจ public/private subnet, routing, NAT |
| Secret management | **AWS Secrets Manager** (หรือ Terraform variable ที่ไม่ commit) | ห้าม hardcode credential ในโค้ดเด็ดขาด |
| Monitoring | **CloudWatch** (alarm พื้นฐาน) | เพิ่มทีหลังหลัง MVP รันได้แล้ว |
| Terraform state | **S3 backend + DynamoDB lock** | best practice มาตรฐาน ป้องกัน state ชนกันและเก็บ state ปลอดภัยกว่า local |

### ระดับความซับซ้อนที่ตั้งใจไว้
เริ่มที่ **MVP ก่อนเสมอ** — ให้ระบบ deploy ได้จริงและรันได้ครบ flow ก่อน แล้วค่อยเพิ่มของแถม (monitoring, chaos test, security scan) หลังจากนั้น ห้ามเพิ่ม scope ระหว่างทำ MVP เด็ดขาด เพราะจะเสี่ยงทำไม่เสร็จ

---

## 3. แอปพลิเคชันที่ใช้เป็นโค้ดตั้งต้น

### 3.1 Repo ต้นทาง
- **ชื่อ repo ต้นฉบับ:** `mjftw/typescript-realworld-backend`
- **ลิงก์:** https://github.com/mjftw/typescript-realworld-backend
- **Repo ของตัวเองหลัง fork:** `aws-infra-practice-project`

### 3.2 คืออะไร
เป็น backend implementation ของ **RealWorld API spec** (โปรเจกต์ demo ชื่อดังในวงการ dev, ทำ Medium.com clone ชื่อ "Conduit") เขียนด้วย **TypeScript + Express + PostgreSQL** เป็น **backend ล้วน ๆ ไม่มี frontend มาให้**

Feature ที่มีในแอป:
- User authentication ด้วย JWT (register/login)
- CRUD Articles
- Comments
- Follow/Unfollow users
- Personalized feed
- Pagination

### 3.3 ทำไมเลือกตัวนี้
- **ไม่ง่ายเกินไป** — มีความสัมพันธ์ระหว่างตารางหลายชั้น (users, articles, comments, follows) ไม่ใช่ CRUD ตารางเดียวโดด ๆ แบบ to-do list ทั่วไป ใกล้เคียงงานจริงมากกว่า
- **Environment variable สะอาดอยู่แล้ว** — ใช้ `APP_PORT`, `JWT_SECRET`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` ไม่ใช้ Docker secrets file-based ที่ซับซ้อนเกินจำเป็น
- **ไม่มี frontend/nginx ผูกมาด้วย** — ทำให้ ALB ยิงตรงเข้า container ได้เลย ไม่ต้องตัดอะไรออกจากของเดิม
- **มี test suite (Jest)** — เห็นโครงสร้างโปรเจกต์แบบมืออาชีพ

### 3.4 สิ่งที่ต้องปรับแก้จากโค้ดต้นฉบับ
1. **เพิ่ม environment variable `DB_HOST`** — ของเดิมไม่มีตัวแปรนี้ (คงชี้ไปที่ service name `postgres` ใน docker-compose เดิมตรง ๆ) ต้องเพิ่มเข้าไปให้ config รับค่าจาก env var แล้วชี้ไปที่ RDS endpoint แทน
2. **เพิ่ม endpoint `/health`** — ถ้ายังไม่มี ต้องเพิ่มเข้าไปสำหรับให้ ALB target group เรียก health check ได้ (ควร return HTTP 200 แบบเบา ๆ ไม่ query database ทุกครั้งเพื่อไม่ให้ health check ไปเพิ่มโหลด DB)
3. **ลบ Dockerfile เดิมทิ้ง** แล้วเขียนใหม่เอง (ดูหมวด "นโยบายการใช้ AI" — ส่วนนี้ต้องเขียนเอง)
4. **ตรวจสอบ migration/seed script** — แอปนี้น่าจะมี script สร้างตารางต้องดูว่ารันตอนไหน ต้องรันก่อน app start หรือมี migration tool แยก

### 3.5 ขั้นตอน Fork และ Clone
```bash
# 1. เข้า https://github.com/mjftw/typescript-realworld-backend แล้วกด Fork
#    เปลี่ยนชื่อ repo หลัง fork เป็น aws-infra-practice-project (ทำได้ผ่าน Settings > Rename)

# 2. Clone จาก repo ของตัวเอง (ไม่ใช่ของเจ้าของเดิม)
git clone https://github.com/<username>/aws-infra-practice-project.git
cd aws-infra-practice-project
```

---

## 4. นโยบายการใช้ AI ในโปรเจกต์นี้ (สำคัญที่สุด — อ่านก่อนช่วยทุกครั้ง)

หลักการรวม: **AI ช่วยได้เต็มที่ในส่วนที่ไม่ใช่เป้าหมายการเรียนรู้หลัก แต่ในส่วนที่เป็นทักษะที่ต้องการฝึกจริง (Terraform, Docker, การออกแบบ security) ต้องเขียนเองก่อนเสมอ AI มีหน้าที่แค่อธิบาย/ช่วย debug ไม่ใช่ generate ให้ทั้งหมด**

### 4.1 Terraform — กฎเข้มงวดที่สุด (เป้าหมายการเรียนรู้หลักของโปรเจกต์)
**เหตุผล:** ผู้ใช้ต้องการ "เขียนเป็น" ไม่ใช่แค่ "อ่านเป็น" เพราะ Terraform คือทักษะที่ตลาดงานต้องการมากที่สุดในสายนี้

กฎที่ต้องทำตามทุกครั้ง:
1. **ก่อนเขียน resource ใหม่ทุกครั้ง** ให้เปิด Terraform Registry documentation ของ provider นั้นอ่านเองก่อน (เช่น `registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc`)
2. **เขียน draft แรกด้วยตัวเองเสมอ** ต่อให้ผิดหรือไม่สมบูรณ์ก็ตาม ห้ามขอ AI เขียนให้ตั้งแต่ต้น
3. **ถ้าเขียนแล้วรัน `terraform plan`/`apply` แล้ว error** — ตรงนี้ค่อยเอา error message ไปถาม AI ได้เต็มที่ ให้ AI ช่วยอธิบายว่า error หมายถึงอะไร ไม่ใช่ขอให้เขียนไฟล์ใหม่ทั้งหมดให้
4. **ถ้าไม่แน่ใจ syntax** — ถาม AI แบบเจาะจงเท่านั้น เช่น "attribute `route` ใน `aws_route_table` ต้องใส่ `cidr_block` ยังไง" ไม่ใช่ "เขียน route table ให้หน่อย"
5. **ห้ามพูดกับ AI ว่า** "เขียน Terraform ทั้งหมดให้หน่อย" หรือ "ช่วย generate infra ให้ที" เด็ดขาดในทุกเฟส
6. หลังเขียนเสร็จแต่ละไฟล์ ให้ AI **review** ได้ (ชี้จุดที่ควรปรับปรุง, security issue, best practice) — การ review ทำได้เต็มที่ เพราะเป็นการเรียนรู้ ไม่ใช่การให้ AI ทำแทน

### 4.2 Docker — เขียนเองเช่นกัน
**เหตุผล:** ต้องการเข้าใจ containerization จริง ไม่ใช่แค่ copy Dockerfile จากที่อื่น
- เขียน `Dockerfile` เองจากศูนย์ อ่าน base image documentation เอง
- ถ้า build/run แล้ว error ค่อยถาม AI ช่วย debug (เหมือนกับ Terraform)
- AI ช่วย **อธิบาย** concept ได้เต็มที่ (เช่น "multi-stage build คืออะไร ทำไมช่วยลดขนาด image") แต่ไม่เขียน Dockerfile ให้ทั้งไฟล์ตั้งแต่ต้น

### 4.3 ส่วนที่ให้ AI ช่วยร่าง/generate ได้เต็มที่ (ไม่ใช่เป้าหมายการเรียนรู้หลัก)
- **ทำความเข้าใจโค้ดแอป TypeScript ต้นฉบับ** — ให้ AI อ่านและสรุปโค้ดให้ฟังได้เต็มที่ (endpoint มีอะไร, connection logic อยู่ตรงไหน) เพราะเป้าหมายคือ deploy ไม่ใช่เขียนแอปเอง
- **GitHub Actions workflow YAML** — ให้ AI ร่างได้เต็มที่ เป็น boilerplate ที่ไม่ใช่ทักษะหลักที่ต้องการฝึก แต่ต้องอ่านทำความเข้าใจทุกบรรทัดหลัง AI เขียนให้ ห้ามใช้แบบไม่รู้ว่าทำอะไร
- **README.md structure/formatting** — ให้ AI ช่วยจัดโครงสร้างได้ แต่เนื้อหาส่วน "เหตุผลการออกแบบ" ต้องเขียนด้วยคำพูดตัวเองเสมอ ห้ามให้ AI เขียนแทนทั้งหมด

### 4.4 ห้าม AI ทำแทนโดยเด็ดขาด ไม่ว่ากรณีใด
- เขียน Terraform resource block ให้ทั้งไฟล์ตั้งแต่เริ่มต้น (ก่อนที่ผู้ใช้จะลองเขียนเองก่อน)
- เขียน Dockerfile ให้ทั้งไฟล์ตั้งแต่เริ่มต้น
- ตัดสินใจ architecture design แทน (เช่น เลือก CIDR block, จำนวน AZ, security group rule) — AI ช่วย "ให้ความเห็น" ได้ แต่การตัดสินใจสุดท้ายต้องเป็นของผู้ใช้
- ใส่ credential/secret ตรง ๆ ในโค้ดหรือแนะนำให้ hardcode
- เขียนคำตอบสัมภาษณ์ให้ท่องจำ (ต้องคิดเองตามหมวด 9)

---

## 5. AWS Account — บริบทและข้อควรระวัง

### 5.1 บัญชีที่ใช้
- ใช้ AWS **Free plan** (ไม่ใช่ free tier แบบเดิม) — ได้เครดิต **$100 USD**
- หมดอายุ: **6 เดือนจากวันสมัคร หรือเมื่อเครดิตหมด แล้วแต่อย่างไหนถึงก่อน** (กรณีนี้หมดอายุประมาณ 17 ธันวาคม 2026)
- ล็อกอินผ่าน **IAM user (`iamadmin`)** ไม่ใช้ root user ทำงานประจำ

### 5.2 พฤติกรรมการใช้งาน
- ใช้งานแบบไม่สม่ำเสมอ (เปิด-ปิดบ่อย ทดลองผิดถูก) — **ไม่มีปัญหา** เพราะ AWS คิดเงินตามชั่วโมงที่รันจริง ไม่ใช่ตามจำนวนครั้งที่ login

### 5.3 กฎความปลอดภัยด้านงบประมาณ (ต้องทำตามเคร่งครัด)
1. ตั้ง **AWS Budget alert ที่ $10** ตั้งแต่วันแรกที่เริ่มทำโปรเจกต์
2. **`terraform destroy` ทันทีทุกครั้งหลังทดสอบเสร็จในแต่ละรอบ** ห้ามเปิดทิ้งไว้ข้ามคืนโดยไม่จำเป็น
3. ก่อนปิดเครื่องทุกครั้ง เช็ค 2 จุด: (1) EC2 Console ว่ามี instance รันค้างไหม (2) รัน `terraform destroy` แล้วหรือยัง
4. Resource ที่ **เสียเงินแม้อยู่ใน "free" plan** และต้องระวังเป็นพิเศษ: **NAT Gateway** และ **Application Load Balancer** — คิดเงินรายชั่วโมงตลอดเวลาที่เปิดอยู่ ไม่ได้ฟรี
5. **ห้าม commit AWS access key/secret key ลง Git เด็ดขาด** — ใช้ GitHub Secrets สำหรับ CI/CD และเพิ่ม `.gitignore` บล็อกไฟล์ `.tfvars`, `.env`, `credentials` ตั้งแต่ commit แรก
6. เปิด **MFA** ทั้ง root account และ IAM user

---

## 6. Architecture Overview

### 6.1 คำอธิบายภาพรวม (textual)
```
                         Internet
                            │
                     Users (HTTPS)
                            │
        ┌───────────────────────────────────────┐
        │              VPC (10.0.0.0/16)          │
        │                                          │
        │  ┌─────────────────┐  ┌────────────────┐│
        │  │  Public Subnet   │  │ Public Subnet  ││   (2 AZ)
        │  │  (AZ-a)          │  │ (AZ-b)         ││
        │  │  - ALB           │  │ - ALB          ││
        │  │  - NAT Gateway   │  │ (NAT อีก AZ    ││
        │  │                  │  │  ถ้าต้องการ HA)││
        │  └────────┬─────────┘  └────────┬───────┘│
        │           │                     │         │
        │  ┌────────▼─────────┐  ┌────────▼───────┐│
        │  │  Private Subnet   │  │ Private Subnet ││   (2 AZ)
        │  │  (AZ-a)           │  │ (AZ-b)         ││
        │  │  - EC2 (ASG)      │  │ - EC2 (ASG)    ││
        │  │  - Docker container│ │ - Docker       ││
        │  │  - RDS Postgres   │  │   container    ││
        │  │    (Multi-AZ)     │  │                ││
        │  └───────────────────┘  └────────────────┘│
        └───────────────────────────────────────────┘
                            ▲
                            │ deploy (push image)
                    ┌───────┴────────┐
                    │ GitHub Actions │
                    │  CI/CD pipeline│
                    └────────────────┘
                            ▲
                            │ push code
                    ┌───────┴────────┐
                    │   GitHub repo   │
                    │ aws-infra-      │
                    │ practice-project│
                    └─────────────────┘
```

### 6.2 Flow การทำงาน
1. ผู้ใช้เรียก URL ผ่าน ALB DNS
2. ALB กระจาย request ไปยัง EC2 instance (ผ่าน target group, เช็ค health ด้วย `/health` endpoint)
3. EC2 instance รัน Docker container ของแอป (ผ่าน systemd service ที่ user_data ตั้งไว้)
4. แอปเชื่อมต่อ RDS PostgreSQL ผ่าน connection string จาก environment variable
5. เมื่อ push โค้ดขึ้น `main` branch → GitHub Actions build image ใหม่ → push ขึ้น ECR → trigger instance refresh บน Auto Scaling Group

---

## 7. โครงสร้าง Repository เป้าหมาย

```
aws-infra-practice-project/
├── src/                        # โค้ดแอป TypeScript เดิมจาก repo ต้นฉบับ
├── test/                       # test suite เดิม
├── scripts/                    # script เดิมจาก repo ต้นฉบับ
├── Dockerfile                  # เขียนใหม่เอง (ดูหมวด 4.2)
├── .dockerignore                # เขียนใหม่เอง
├── docker-compose.yml           # แก้ไขสำหรับทดสอบ local เท่านั้น (ไม่ใช้ deploy จริง)
├── terraform/                   # เขียนเองทั้งหมด (ดูหมวด 4.1)
│   ├── backend.tf                # ผูก S3 + DynamoDB state
│   ├── providers.tf
│   ├── variables.tf
│   ├── vpc.tf
│   ├── subnets.tf
│   ├── internet_gateway.tf
│   ├── nat_gateway.tf
│   ├── route_tables.tf
│   ├── security_groups.tf
│   ├── iam.tf
│   ├── alb.tf
│   ├── launch_template.tf
│   ├── asg.tf
│   ├── rds.tf
│   ├── ecr.tf
│   ├── cloudwatch.tf            # เพิ่มทีหลังหลัง MVP
│   ├── outputs.tf
│   └── user_data.sh              # bash script ติดตั้ง Docker บน EC2
├── .github/
│   └── workflows/
│       ├── terraform-plan.yml    # รันทุก PR
│       ├── terraform-apply.yml   # รันเมื่อ merge main (มี manual approve)
│       └── build-deploy.yml      # build image, push ECR, trigger deploy
└── README.md                     # เขียนเอง (ดูหมวด 4.3)
```

---

## 8. Checklist งานแบบละเอียดที่สุด แบ่งเป็นเฟส

### Phase 0 — เตรียมเครื่องมือและ Account
- [ ] ติดตั้ง Docker Desktop, Terraform CLI (`terraform -v` เช็คว่าติดตั้งสำเร็จ), AWS CLI v2, Git
- [ ] สร้าง IAM user แยกสำหรับใช้งาน (ถ้ายังไม่มี) พร้อม MFA
- [ ] รัน `aws configure` ผูก access key ของ IAM user (ไม่ใช่ root)
- [ ] ตั้ง AWS Budget alert ที่ $10 ผ่าน Billing and Cost Management console
- [ ] Fork repo ต้นฉบับ เปลี่ยนชื่อเป็น `aws-infra-practice-project` แล้ว clone ลงเครื่อง
- [ ] ลบ `Dockerfile` และ `docker-compose.yml` เดิมออกจาก repo (จะเขียนใหม่ใน Phase 2)
- [ ] เพิ่ม `.gitignore` บล็อก `*.tfvars`, `.env`, `.terraform/`, `terraform.tfstate*`

### Phase 1 — ปรับแอปให้พร้อมรับ config จากภายนอก
- [ ] เปิดอ่านโค้ดใน `src/` ทำความเข้าใจโครงสร้าง (ให้ AI ช่วยสรุปได้ตามหมวด 4.3)
- [ ] หาไฟล์ config ที่อ่าน environment variable (`DB_USERNAME`, `DB_PASSWORD` ฯลฯ) เพิ่ม `DB_HOST` เข้าไปในนั้น
- [ ] เพิ่ม route `/health` ใน Express app ที่ return HTTP 200 แบบไม่ query database
- [ ] สร้างไฟล์ `.env.example` ระบุ environment variable ทั้งหมดที่แอปต้องการ (ไม่ใส่ค่าจริง)
- [ ] ทดสอบรัน local ด้วย Postgres ที่ลงในเครื่อง (ไม่ใช้ Docker) ให้แอปต่อ database ได้และผ่านก่อน ค่อยไปต่อ Docker

### Phase 2 — เขียน Docker เอง
- [ ] อ่าน Docker documentation เรื่อง multi-stage build ก่อนเขียน
- [ ] เขียน `Dockerfile` เอง: เลือก base image (`node:20-alpine` หรือใกล้เคียง), `WORKDIR`, `COPY package*.json`, `RUN npm install`, `COPY . .`, `RUN npm run build` (ถ้ามี build step ของ TypeScript), `EXPOSE <port>`, `CMD`
- [ ] เขียนแบบ multi-stage: stage แรกสำหรับ build (มี devDependencies), stage สองสำหรับ run (เอาแค่ผลลัพธ์ build + production dependencies) เพื่อลดขนาด image
- [ ] เขียน `.dockerignore` (บล็อก `node_modules`, `.git`, `.env`)
- [ ] เขียน `docker-compose.yml` ใหม่สำหรับทดสอบ local เท่านั้น (app + postgres, ใช้ env var ธรรมดา)
- [ ] รัน `docker build -t aws-infra-practice-app .` ทดสอบให้ build ผ่าน
- [ ] รัน `docker compose up` ทดสอบให้แอปต่อ database local ได้ผ่าน ALB ยังไม่เกี่ยว
- [ ] ตรวจสอบว่า container ไม่ได้รันด้วย root user (เพิ่ม `USER node` หรือสร้าง non-root user ใน Dockerfile)
- [ ] ทดสอบยิง `curl localhost:<port>/health` ให้ผ่าน

### Phase 3 — Terraform Backend และโครงสร้างเริ่มต้น
- [ ] สร้าง S3 bucket ด้วยมือผ่าน AWS Console หรือ CLI (ตั้งชื่อ unique เช่น `<username>-tfstate-aws-infra-practice`)
- [ ] เปิด versioning บน S3 bucket นั้น (กันเผลอ overwrite state)
- [ ] สร้าง DynamoDB table ด้วยมือ (partition key ชื่อ `LockID` type String) สำหรับ state locking
- [ ] สร้างโฟลเดอร์ `terraform/` ตามโครงสร้างในหมวด 7
- [ ] เขียน `providers.tf` (ระบุ AWS provider, region)
- [ ] เขียน `backend.tf` ผูก S3 bucket + DynamoDB table ที่สร้างไว้
- [ ] รัน `terraform init` ให้ผ่าน

### Phase 4 — Networking (VPC)
- [ ] ตัดสินใจเอง: CIDR block ของ VPC (แนะนำ `10.0.0.0/16`), จำนวน AZ (แนะนำ 2), CIDR ของแต่ละ subnet
- [ ] เขียน `variables.tf` ประกาศตัวแปรที่จะใช้ซ้ำ (region, cidr, availability_zones)
- [ ] เขียน `vpc.tf` — resource `aws_vpc`
- [ ] เขียน `subnets.tf` — public subnet 2 อัน (คนละ AZ), private subnet 2 อัน (คนละ AZ) ใช้ `aws_subnet` พร้อม `map_public_ip_on_launch = true` สำหรับ public subnet
- [ ] เขียน `internet_gateway.tf` — `aws_internet_gateway` ผูกกับ VPC
- [ ] เขียน `nat_gateway.tf` — `aws_eip` (elastic IP) + `aws_nat_gateway` วางไว้ใน public subnet
- [ ] เขียน `route_tables.tf` — public route table ชี้ไป IGW (`0.0.0.0/0` → `aws_internet_gateway`), private route table ชี้ไป NAT (`0.0.0.0/0` → `aws_nat_gateway`)
- [ ] เขียน `aws_route_table_association` ผูก subnet แต่ละอันกับ route table ที่ถูกต้อง
- [ ] รัน `terraform plan` ตรวจสอบก่อน apply — อ่าน resource ที่จะสร้างทีละบรรทัด
- [ ] รัน `terraform apply`
- [ ] เข้า AWS Console ยืนยันว่า VPC/subnet/route table ถูกสร้างตามที่ตั้งใจจริง
- [ ] **ตอบให้ได้ก่อนไปต่อ:** ทำไม route table ของ private subnet ต้องชี้ไป NAT Gateway ไม่ใช่ Internet Gateway โดยตรง

### Phase 5 — Security (Security Groups + IAM)
- [ ] ออกแบบเอง (ห้ามให้ AI เลือกให้): ALB security group รับ inbound 443/80 จาก `0.0.0.0/0`, EC2 security group รับ inbound เฉพาะจาก ALB's security group เท่านั้น, RDS security group รับ inbound เฉพาะจาก EC2's security group เท่านั้น
- [ ] เขียน `security_groups.tf` — 3 security group ตามที่ออกแบบไว้
- [ ] เขียน `iam.tf` — IAM role สำหรับ EC2 instance profile ให้สิทธิ์ `AmazonEC2ContainerRegistryReadOnly` (หรือ policy ที่ scope แคบกว่านั้นถ้าทำได้) เพื่อ pull image จาก ECR
- [ ] ตรวจสอบเอง: ไม่มี `0.0.0.0/0` หลุดเข้า EC2 หรือ RDS โดยตรงเลย มีแค่ ALB เท่านั้นที่เปิดสู่ internet
- [ ] รัน `terraform plan` + `apply`

### Phase 6 — Compute (Launch Template + Auto Scaling Group + ALB)
- [ ] เขียน `user_data.sh` — bash script ที่ EC2 รันตอน boot: ติดตั้ง Docker, login เข้า ECR (`aws ecr get-login-password`), `docker pull` image ล่าสุด, สร้าง systemd service unit file ให้รัน container พร้อม `Restart=always`
- [ ] เขียน `launch_template.tf` — `aws_launch_template` อ้างอิง AMI (Amazon Linux 2023), instance type (`t2.micro`/`t3.micro`), IAM instance profile จาก Phase 5, `user_data` (ต้อง base64 encode)
- [ ] เขียน `alb.tf` — `aws_lb` (application type, วางใน public subnet), `aws_lb_target_group` (target type `instance`, health check path `/health`, port ตรงกับที่แอป expose), `aws_lb_listener` (port 80 หรือ 443)
- [ ] เขียน `asg.tf` — `aws_autoscaling_group` อ้างอิง launch template, `min_size`/`max_size`/`desired_capacity` (แนะนำเริ่ม 1/2/1 เพื่อประหยัดงบตอนพัฒนา), ผูกกับ target group ของ ALB, `vpc_zone_identifier` ชี้ไป private subnet
- [ ] เขียน scaling policy พื้นฐาน (target tracking บน CPU utilization)
- [ ] รัน `terraform plan` + `apply`
- [ ] **ตอบให้ได้ก่อนไปต่อ:** user_data สคริปต์รันตอนไหนในวงจรชีวิตของ EC2, ถ้า container ข้างในพัง (crash) แต่ EC2 instance ยัง "healthy" ในระดับ AWS จะเกิดอะไรขึ้น (เชื่อมโยงกับ ALB health check ที่เช็คที่ระดับ HTTP ไม่ใช่ระดับ EC2)

### Phase 7 — Database (RDS)
- [ ] เขียน `rds.tf` — `aws_db_subnet_group` (ใช้ private subnet ทั้งสองอัน), `aws_db_instance` (`db.t3.micro`, engine postgres, `publicly_accessible = false`, single-AZ ระหว่างพัฒนาเพื่อประหยัดงบ)
- [ ] ตัดสินใจเก็บ password: ใช้ Terraform variable ที่ mark `sensitive = true` และไม่ commit ไฟล์ `.tfvars` ที่มีค่าจริงลง git หรือใช้ AWS Secrets Manager (`aws_secretsmanager_secret` + `random_password` resource ให้ Terraform generate ให้)
- [ ] รัน `terraform plan` + `apply`
- [ ] ทดสอบ SSH เข้า EC2 (ผ่าน Session Manager จะดีกว่า SSH key เพราะไม่ต้องเปิด port 22) แล้วลอง `psql` เชื่อมต่อ RDS ให้ผ่าน

### Phase 8 — Build และ Push Image ขึ้น ECR (manual ก่อน)
- [ ] เขียน `ecr.tf` — `aws_ecr_repository`
- [ ] รัน `terraform apply` สร้าง ECR repo
- [ ] Build image, tag, และ push ด้วยมือครั้งแรกตามคำสั่งที่ AWS Console บอก (`aws ecr get-login-password | docker login...`, `docker tag`, `docker push`) เพื่อเข้าใจ flow เต็ม ๆ ก่อนอัตโนมัติ
- [ ] Restart EC2 instance (หรือรอ user_data รันใหม่) ตรวจสอบว่า pull image จาก ECR สำเร็จ container รันจริง
- [ ] เข้า ALB DNS name จาก browser หรือ `curl` ทดสอบว่าเว็บ/API ใช้งานได้จริง — **นี่คือจุดพิสูจน์ว่าระบบทำงานครบ end-to-end**

### Phase 9 — CI/CD ด้วย GitHub Actions
- [ ] ตั้งค่า GitHub Secrets ผ่าน GitHub UI: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (ของ IAM user ที่มีสิทธิ์จำกัดเท่าที่จำเป็น ไม่ใช่ full admin ถ้าทำได้)
- [ ] เขียน (ให้ AI ช่วยร่างได้เต็มที่ตามหมวด 4.3) `.github/workflows/terraform-plan.yml` — รันทุกครั้งที่มี pull request แก้ไฟล์ใน `terraform/`
- [ ] เขียน `.github/workflows/terraform-apply.yml` — รันเมื่อ merge เข้า `main`, ต้องมี manual approval step (ใช้ GitHub Environment protection rule)
- [ ] เขียน `.github/workflows/build-deploy.yml` — build Docker image, push ขึ้น ECR, trigger ASG instance refresh (`aws autoscaling start-instance-refresh`)
- [ ] อ่านทำความเข้าใจทุกบรรทัดใน workflow ที่ AI ช่วยร่างให้ ห้ามใช้แบบไม่รู้ว่าทำอะไร
- [ ] ทดสอบ push commit เล็ก ๆ ดูว่า pipeline รันสำเร็จ
- [ ] **ตอบให้ได้ก่อนไปต่อ:** ทำไมต้องมี manual approve step ก่อน apply Terraform บน environment ที่ถือว่าเป็น "production"

### Phase 10 — Monitoring และเอกสาร
- [ ] เขียน `cloudwatch.tf` — alarm พื้นฐาน: CPU utilization สูงกว่า threshold, RDS connection count สูงผิดปกติ
- [ ] เขียน `README.md` ครบทุกหัวข้อ: overview, architecture diagram (ใช้ ASCII จากหมวด 6 หรือวาดใหม่), เหตุผลการออกแบบแต่ละจุด (เขียนด้วยคำตัวเอง), วิธีรันเอง (setup instructions), cost consideration, known limitations
- [ ] ถ่าย screenshot หรืออัดคลิปสั้น ๆ ตอน demo ใช้งานจริง เก็บไว้แนบใน README

### Phase 11 — Cleanup Habit (ทำทุกครั้งหลังเทส)
- [ ] รัน `terraform destroy` ทันทีหลังทดสอบเสร็จ
- [ ] เข้า AWS Console เช็ค EC2, RDS, NAT Gateway, ALB ว่าไม่มีอะไรค้างอยู่ก่อนปิดเครื่อง
- [ ] เช็ค AWS Billing dashboard เป็นระยะ (อย่างน้อยสัปดาห์ละครั้ง)

### Phase 12 (ของแถม — ทำหลัง MVP เสร็จสมบูรณ์แล้วเท่านั้น)
- [ ] Chaos test: kill EC2 instance ระหว่างที่ระบบรันอยู่ บันทึกว่า ASG replace instance ใหม่ยังไง เขียนผลลง README
- [ ] รัน security scanner เช่น `tfsec` หรือ `checkov` สแกนโค้ด Terraform หาจุดที่ควรแก้ แล้วแก้ตามที่เจอ
- [ ] ลอง deploy RDS แบบ Multi-AZ แทน single-AZ (เปิดแค่ตอน demo แล้วปิดกลับ single-AZ เพื่อประหยัดงบ)

---

## 9. คำถามที่ต้องเตรียมคำตอบเอง ก่อนสัมภาษณ์ (ห้าม AI เขียนคำตอบให้ท่อง)

- ทำไมเลือก EC2 + Auto Scaling Group แทน ECS Fargate มีข้อดี/ข้อเสียต่างกันยังไง
- ถ้า Docker container ข้างใน EC2 crash จะรู้ได้ยังไง ระบบ recover เองได้ยังไง (เชื่อมโยง systemd `Restart=always` + ALB health check)
- ถ้า traffic เพิ่มขึ้น 10 เท่า ต้องแก้ตรงไหนในสถาปัตยกรรมนี้บ้าง
- Security group ออกแบบ least privilege ยังไง อธิบายทีละชั้น (ALB → EC2 → RDS)
- ทำไม Terraform state ต้องเก็บบน S3 remote backend พร้อม DynamoDB lock ไม่ใช่เก็บ local
- ทำไม private subnet ต้องออก internet ผ่าน NAT Gateway ไม่ใช่ Internet Gateway โดยตรง
- ตอนทำโปรเจกต์ติดปัญหาอะไรบ้าง แก้ยังไง (ต้องมีเคสจริงจากที่เจอตอนทำ ไม่ใช่เคสสมมติ)
- ตอนไหนที่ใช้ AI ช่วย ตอนไหนที่ทำเอง (ตอบตรง ๆ ได้เลยตามหมวด 4 เพราะเป็นเรื่องปกติในตลาดปี 2026 แต่ต้องอธิบายได้ว่าทำไมแบ่งแบบนั้น)
- ถ้าให้ปรับปรุงโปรเจกต์นี้ต่อจะทำอะไรเพิ่ม (เตรียมคำตอบจาก Phase 12 หรือคิดเพิ่มเอง)

---

## 10. ปัญหาที่มักเจอจริงตอนทำ (เตรียมใจไว้ล่วงหน้า)

| ปัญหา | อาการ | แนวทางเริ่มต้นไล่หา |
|---|---|---|
| ALB target group unhealthy | เข้าเว็บผ่าน ALB ไม่ได้ ทั้งที่ EC2 รันอยู่ | เช็ค security group เปิด port ถูกไหม, health check path ตรงกับที่แอปมีจริงไหม, container listen port ตรงกับที่ target group ตั้งไหม |
| Private subnet ออก internet ไม่ได้ | EC2 ใน private subnet ดึง Docker image ไม่ได้ | เช็คว่า NAT Gateway อยู่ AZ เดียวกับที่ route table ของ private subnet นั้นชี้ไปหรือไม่ |
| RDS connect timeout จาก EC2 | แอป start ไม่ได้ ต่อ database ไม่ผ่าน | เช็ค security group ของ RDS อนุญาต EC2's SG จริงไหม, subnet group ตั้งถูก subnet ไหม, endpoint/port ที่ใช้ตรงไหม |
| Terraform state lock ค้าง | `apply` ไม่ผ่าน ขึ้น error เรื่อง lock | ตรวจสอบว่ามี process อื่นรัน apply ค้างอยู่จริงไหมก่อน force-unlock (ห้าม force-unlock พร่ำเพรื่อ เสี่ยง state เสียหาย) |
| Docker image รันบน local ได้แต่บน EC2 ไม่ได้ | container start แล้ว exit ทันที | เช็ค CPU architecture (ARM บนเครื่อง Mac M1/M2 vs x86 บน EC2), environment variable ที่ส่งเข้า container ครบไหม |

---

## 11. Timeline และงบประมาณ

- บัญชี AWS Free plan: เครดิต $100, หมดอายุ ~17 ธันวาคม 2026 — เพียงพอมากถ้าทำตามกฎ destroy-หลังใช้ในหมวด 5.3
- ประเมินเวลา (ยืดหยุ่นได้ตามภาระเรียนเทอม 1):
  - สัปดาห์ที่ 1: Phase 0–5 (เตรียมเครื่องมือ, ปรับแอป, Docker, networking, security)
  - สัปดาห์ที่ 2: Phase 6–8 (compute, database, build/push image)
  - สัปดาห์ที่ 3: Phase 9–11 (CI/CD, monitoring, เอกสาร, cleanup habit)
  - หลังจากนั้น: Phase 12 (ของแถม) ถ้ามีเวลาเหลือก่อน deadline สมัครฝึกงาน
- ใช้เวลาประมาณ 8-10 ชั่วโมง/สัปดาห์ ควบคู่กับการเรียนคอร์ส Cantrill และเรียนเทอม 1

---

## 12. กฎเหล็กที่ต้องทำตามตลอดทั้งโปรเจกต์

1. **ห้าม commit credential ใด ๆ ลง Git** (access key, database password, JWT secret) — ใช้ env var/GitHub Secrets/Secrets Manager เท่านั้น
2. **ห้ามใช้ root user ทำงานประจำ** ใช้ IAM user เสมอ
3. **`terraform destroy` ทุกครั้งหลังเทสเสร็จ** ไม่มีข้อยกเว้น
4. **เขียน Terraform และ Dockerfile เองก่อนเสมอ** ก่อนจะถาม AI (ดูหมวด 4)
5. **ตอบคำถามหมวด 9 ให้ได้ด้วยตัวเอง** ก่อนถือว่าโปรเจกต์พร้อมใช้สัมภาษณ์จริง
6. **ทดสอบทุกเฟสด้วย `terraform plan` ก่อน `apply` เสมอ** อ่านผลลัพธ์ก่อนกดยืนยันทุกครั้ง
