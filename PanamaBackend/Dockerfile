# Stage 1: Build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY . .

RUN mkdir -p /data

# Publish for release (creates /app/out)
RUN dotnet publish -c Release -o /app/out

# Stage 2: Run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published output
COPY --from=build /app/out .

# (Optional) Set correct file permissions, now that /app exists
RUN chmod -R 777 /app

# Configure ASP.NET Core to listen on port 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "PanamaBackend.dll"]