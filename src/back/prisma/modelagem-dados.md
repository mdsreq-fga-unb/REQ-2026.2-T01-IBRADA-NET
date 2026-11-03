# Modelagem de dados – IBRADA-NET

Gerado a partir de `REQ-2026.2-T01-IBRADA-NET/src/back/prisma/schema.prisma` (MySQL).
Para visualizar o diagrama: abra este arquivo no VS Code com a extensão "Markdown Preview Mermaid Support", ou cole o bloco em https://mermaid.live.

## Diagrama ER

```mermaid
erDiagram
    User ||--o{ ConsentRecord : "aceita termos (US23)"
    User ||--o{ Booking : "faz reservas (US08)"
    User ||--o| PerfilVoluntario : "tem perfil (US15)"

    Experiencia ||--o{ Booking : "é reservada"
    Booking ||--o{ Payment : "tem pagamentos (US10)"

    Projeto ||--o{ Oportunidade : "gera vagas (US13)"
    PerfilVoluntario ||--o{ Candidatura : "se candidata (US16)"
    Oportunidade ||--o{ Candidatura : "recebe (US18)"

    PerfilVoluntario }o--o{ Habilidade : "possui"
    Oportunidade }o--o{ Habilidade : "requer"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        string phone
        Role role "CLIENTE | VOLUNTARIO | GESTOR"
        datetime createdAt
        datetime updatedAt
    }

    ConsentRecord {
        string id PK
        string userId FK
        string termVersion
        datetime acceptedAt
    }

    Experiencia {
        string id PK
        string slug UK
        string title
        text description
        text itinerary
        decimal price
        datetime startsAt
        datetime endsAt
        int capacity
        boolean isAvailable
        datetime createdAt
        datetime updatedAt
    }

    Booking {
        string id PK
        string userId FK
        string experienceId FK
        int seats
        decimal totalAmount
        BookingStatus status "PENDING | CONFIRMED | CANCELED"
        datetime createdAt
    }

    Payment {
        string id PK
        string bookingId FK
        decimal amount
        string method
        PaymentStatus status "PENDING | PAID | FAILED | REFUNDED"
        string externalId
        datetime paidAt
        datetime createdAt
    }

    PedidoParceria {
        string id PK
        string organization
        string contactName
        string contactEmail
        string contactPhone
        text proposal
        PartnershipStatus status "RECEIVED | IN_ANALYSIS | ACCEPTED | DECLINED"
        datetime createdAt
    }

    Habilidade {
        string id PK
        string nome UK
    }

    Projeto {
        string id PK
        string title
        text description
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }

    PerfilVoluntario {
        string id PK
        string userId FK, UK
        text bio
        string outros
        text experiencias
        text interesses
        text disponibilidade
        datetime createdAt
        datetime updatedAt
    }

    Oportunidade {
        string id PK
        string projetoId FK
        string title
        text description
        string duracao
        string disponibilidade
        boolean isOpen
        datetime createdAt
        datetime updatedAt
    }

    Candidatura {
        string id PK
        string perfilId FK
        string oportunidadeId FK
        StatusCandidatura status "INSCRITO | EM_ANALISE | ENTREVISTA | APROVADO | REJEITADO"
        text mensagem
        datetime createdAt
        datetime updatedAt
    }
```

> `PedidoParceria` aparece sem linhas de relação de propósito: quem envia a solicitação é visitante, sem conta (US19).
> `Candidatura` tem restrição única em (`perfilId`, `oportunidadeId`): ninguém se candidata duas vezes à mesma vaga.
> As ligações `}o--o{` com `Habilidade` viram tabelas de junção automáticas no banco (relação muitos-para-muitos implícita do Prisma).

## Resumo por tema

| Tema | Tabelas | User stories |
| --- | --- | --- |
| Conta e LGPD | `User`, `ConsentRecord` | US04–US07, US17, US22, US23 |
| Ecoturismo e reservas | `Experiencia`, `Booking`, `Payment` | US02, US03, US08–US12 |
| Voluntariado | `Projeto`, `Oportunidade`, `Candidatura`, `PerfilVoluntario`, `Habilidade` | US13–US18, US21 |
| Parcerias | `PedidoParceria` | US19, US20 |

## Enums

| Enum | Valores |
| --- | --- |
| `Role` | CLIENTE, VOLUNTARIO, GESTOR |
| `BookingStatus` | PENDING, CONFIRMED, CANCELED |
| `PaymentStatus` | PENDING, PAID, FAILED, REFUNDED |
| `PartnershipStatus` | RECEIVED, IN_ANALYSIS, ACCEPTED, DECLINED |
| `StatusCandidatura` | INSCRITO, EM_ANALISE, ENTREVISTA, APROVADO, REJEITADO |
